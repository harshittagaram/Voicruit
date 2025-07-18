// src/pages/InterviewRoom.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Vapi from "@vapi-ai/web";
import { useInterviewData } from "../context/InterviewDataContext";
import ErrorBoundary from "../components/ErrorBoundary";
import AlertConfirmation from "../components/AlertConfirmation";

function InterviewRoom() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "Candidate";
  const { interviewInfo, setInterviewInfo } = useInterviewData();
  const vapiRef = useRef(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);

  useEffect(() => {
    console.log(
      "InterviewRoom - questionList:",
      interviewInfo.interviewData.questionList
    );
    if (!interviewInfo.userName) {
      setInterviewInfo((prev) => ({
        ...prev,
        userName: name,
      }));
    }
    // Fallback for empty questionList
    if (interviewInfo.interviewData.questionList.length === 0) {
      console.warn("No questions found, setting default questions");
      setInterviewInfo((prev) => ({
        ...prev,
        interviewData: {
          ...prev.interviewData,
          questionList: [
            "Can you explain what SpringBoot is and its main benefits in the development of a backend application?",
            "Describe your experience with Spring Boot, including projects you've worked on.",
            "Explain how you leveraged Spring Boot's features like auto-configuration.",
          ],
        },
      }));
    }
  }, [interviewInfo, name, setInterviewInfo]);

  const startInterview = () => {
    if (vapiRef.current) return;
    if (interviewInfo.interviewData.questionList.length === 0) {
      console.error("Cannot start interview: No questions available");
      return;
    }

    const vapi = new Vapi("710b92d8-20aa-4191-b966-795efe3d816d");
    vapiRef.current = vapi;

    vapi.on("call-start", () => console.log("Call started"));
    vapi.on("call-end", () => console.log("Call ended"));
    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      if (error.error instanceof Response) {
        error.error.text().then((text) => console.log("Error details:", text));
      }
    });
    vapi.on("message", (message) => {
      console.log("Vapi message:", message);
    });

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${
        interviewInfo.userName
      }, how are you? Ready for your interview on ${
        interviewInfo.interviewData.jobTitle || "Interview"
      }?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              You are an AI voice assistant conducting interviews.
              Your job is to ask candidates the provided interview questions and assess their responses.
              Begin with a friendly introduction, setting a relaxed yet professional tone. Example:
              "Hey there! Welcome to your ${
                interviewInfo.interviewData.jobTitle || "Interview"
              } interview. Let’s get started with a few questions!"

              Ask one question at a time and wait for the candidate’s response before proceeding. Keep questions clear and concise. Below are the questions to ask one by one:
              ${interviewInfo.interviewData.questionList
                .map((q, i) => `${i + 1}. ${q}`)
                .join("\n")}

              If the candidate struggles, offer hints or rephrase the question without giving the answer. Example:
              "Need a hint? Think about how Spring Boot simplifies configuration!"

              Provide brief, encouraging feedback after each answer. Example:
              "Nice! That’s a solid answer."
              "Hmm, not quite! Want to try again?"

              Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"

              After 5–7 questions, wrap up the interview smoothly by summarizing their performance. Example:
              "That was great! You handled some tough questions well. Keep sharpening your skills!"

              End on a positive note:
              "Thanks for chatting! Hope to see you crushing projects soon!"

              Key Guidelines:
              ✅ Be friendly, engaging, and witty
              ✅ Keep responses short and natural, like a real conversation
              ✅ Adapt based on the candidate’s confidence level
              ✅ Ensure the interview remains focused on Spring Boot
            `.trim(),
          },
        ],
      },
    };

    console.log(
      "Assistant Options:",
      JSON.stringify(assistantOptions, null, 2)
    );
    vapi.start(assistantOptions).catch((error) => {
      console.error("Vapi start error:", error);
      if (error instanceof Response) {
        error.text().then((text) => console.log("Error details:", text));
      }
    });

    setIsInterviewStarted(true);
  };

  const stopInterview = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      console.log("Interview stopped");
      setIsInterviewStarted(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="font-bold text-xl mb-4">
          AI Interview Session
          <span className="float-right text-gray-500">Duration: {interviewInfo.interviewData.duration || "15 Min"}</span>
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg">
            No Image
          </div>
          <h2 className="text-2xl font-semibold text-blue-600">
            {interviewInfo?.userName || name}
          </h2>
          <div className="flex gap-4">
            {!isInterviewStarted && (
              <button
                onClick={startInterview}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Start Interview
              </button>
            )}
            {isInterviewStarted && (
              <AlertConfirmation stopInterview={stopInterview}>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                  End Interview
                </button>
              </AlertConfirmation>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-4">
            {isInterviewStarted
              ? "Interview in Progress..."
              : "Click Start to begin"}
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default InterviewRoom;