import React, { useState, useEffect, useRef } from "react";
import {
  useParams,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import Vapi from "@vapi-ai/web";
import ErrorBoundary from "../components/ErrorBoundary";
import AlertConfirmation from "../components/AlertConfirmation";
import { toast } from "react-toastify";

function InterviewRoom() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const vapiRef = useRef(null);
  const startTimeRef = useRef(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userName, setUserName] = useState(
    location.state?.userName || searchParams.get("name") || "Candidate"
  );
  const [jobTitle, setJobTitle] = useState("Interview");
  const [duration, setDuration] = useState("15 Min");
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState("00:00:00");
  const [activeUser, setActiveUser] = useState(true);
  const [conversation, setConversation] = useState([]);
  const conversationRef = useRef([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const initialInfo = location.state?.interviewInfo;
    if (initialInfo) {
      console.log("Using navigation state interviewInfo:", initialInfo);
      setUserName(initialInfo.userName || userName);
      setQuestions(initialInfo.interviewData.questionList || []);
      setJobTitle(initialInfo.interviewData.jobTitle || "Interview");
      setDuration(initialInfo.interviewData.duration || "15 Min");
      setIsLoading(false);
    } else {
      console.log("No navigation state, fetching data for id:", id);
      fetch(`http://localhost:8080/api/interviews/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          console.log("API Response in InterviewRoom:", data);
          const parsedQuestions = [
            data.questions?.question?.map((q) => q.text).filter((q) => q) || [],
            data.questions
              ?.split("\n")
              .map((q) => q.trim())
              .filter((q) => q) || [],
          ]
            .flat()
            .slice(0, 5) || [
            "What SpringBoot is and its main benefits?",
            "Describe your Spring Boot experience.",
            "Explain Spring Boot auto-configuration.",
          ];
          setQuestions(parsedQuestions);
          setJobTitle(data.jobTitle || "Interview");
          setDuration(data.duration || "15 Min");
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching interview data:", err.message);
          setQuestions([
            "What SpringBoot is and its main benefits?",
            "Describe your Spring Boot experience.",
            "Explain Spring Boot auto-configuration.",
          ]);
          setIsLoading(false);
        });
    }

    const timer = setInterval(() => {
      if (isInterviewStarted && startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(
          2,
          "0"
        );
        const seconds = String(elapsed % 60).padStart(2, "0");
        setTime(`${hours}:${minutes}:${seconds}`);
      } else if (!isInterviewStarted) {
        setTime("00:00:00");
      }
    }, 1000);

    const vapi =
      vapiRef.current || new Vapi("710b92d8-20aa-4191-b966-795efe3d816d");
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      console.log("Call started");
      setIsInterviewStarted(true);
      startTimeRef.current = Date.now();
      toast("Call Connected...");
    });
    vapi.on("call-end", () => {
      console.log("Call has ended.");
      toast("Interview Ended");
      GenerateFeedback();
    });
    vapi.on("speech-start", () => {
      console.log("Assistant speech has started.");
      setActiveUser(false);
      toast("Assistant speaking...");
    });
    vapi.on("speech-end", () => {
      console.log("Assistant speech has ended.");
      setActiveUser(true);
      toast("Your turn to speak...");
    });
    vapi.on("message", (message) => {
      if (message?.conversation) {
        console.log("Message received:", message.conversation);
        setConversation(message.conversation);
        conversationRef.current = message.conversation;
      } else {
        console.warn("Received undefined conversation!");
      }
    });

    vapi.on("error", (error) => console.error("Vapi error:", error));

    return () => clearInterval(timer);
  }, [id, location.state, userName]);

  const startInterview = () => {
    if (vapiRef.current && !isInterviewStarted) {
      if (questions.length === 0) {
        console.error("Cannot start interview: No questions available");
        toast.error("No questions available.");
        return;
      }

      const assistantOptions = {
        name: "AI Recruiter",
        firstMessage: `Hi ${userName}, how are you? Ready for your interview on ${jobTitle}?`,
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        voice: { provider: "playht", voiceId: "jennifer" },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `
            You are an AI voice assistant conducting interviews.
            Begin with a friendly introduction. Ask one question at a time from: ${questions
              .map((q, i) => `${i + 1}. ${q}`)
              .join("\n")}.
            Offer hints if needed, provide feedback, and wrap up after 5-7 questions.
            Keep it natural, engaging, and focused on Spring Boot.
          `.trim(),
            },
          ],
        },
      };

      console.log(
        "Assistant Options with questions:",
        JSON.stringify(assistantOptions, null, 2)
      );
      vapiRef.current.start(assistantOptions).catch((error) => {
        console.error("Vapi start error:", error);
        toast.error("Failed to start interview.");
      });
    }
  };

  const stopInterview = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      console.log("Interview stopped");
      setIsInterviewStarted(false);
      startTimeRef.current = null;
      toast("Interview Ended.");
    }
  };

  const GenerateFeedback = () => {
    const conv = conversationRef.current;

    if (conv.length > 0) {
      console.log("Generating feedback with conversation:", conv);
      GenerateFeedbackForm(conv);
    } else {
      console.warn("No conversation data available for feedback.");
      toast.warn("No conversation data to generate feedback.");
      navigate("/completed"); // Navigate to /completed even if no conversation
    }
  };

  const GenerateFeedbackForm = (conv) => {
    console.log("Opening feedback form with:", conv);
    const payload = {
      interviewId: id,
      userName: userName,
      conversation: conv,
      duration: time,
    };
    console.log("Sending payload:", JSON.stringify(payload, null, 2));
    fetch(`http://localhost:8080/api/interviews/${id}/feedback`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFeedback(data.feedback);
        toast.success("Feedback submitted!");
        navigate("/completed"); // Navigate to /completed instead of /interview/feedback
      })
      .catch((err) => {
        console.error("Error submitting feedback:", err.message);
        toast.error("Failed to submit feedback.");
        navigate("/completed"); // Navigate to /completed even on error
      });
  };

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <ErrorBoundary>
      <div className="h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            AI Interview Session
          </h1>
          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{time}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mb-8">
          <div className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-8 h-64">
            <div className="relative">
              {!activeUser && (
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 opacity-75 animate-ping w-16 h-16" />
              )}
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="AI Recruiter"
                className="w-16 h-16 rounded-full object-cover z-10"
              />
            </div>
            <p className="text-gray-700 font-medium mt-2">AI Recruiter</p>
          </div>

          <div className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-8 h-64">
            <div className="relative">
              {activeUser && (
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500 opacity-75 animate-ping w-16 h-16" />
              )}
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl z-10">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
            <p className="text-gray-700 font-medium mt-2">{userName}</p>
          </div>
        </div>

        <div className="flex gap-4">
          {!isInterviewStarted ? (
            <button
              onClick={startInterview}
              className="bg-gray-700 hover:bg-gray-800 text-white rounded-full p-3"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </button>
          ) : (
            <AlertConfirmation stopInterview={stopInterview}>
              <button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </AlertConfirmation>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {isInterviewStarted
            ? "Interview in Progress..."
            : "Click Start to begin"}
        </p>
      </div>
    </ErrorBoundary>
  );
}

export default InterviewRoom;
