// src/pages/InterviewStart.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import photo from "../assets/Voicruit_1.png";
import { useInterviewData } from "../context/InterviewDataContext";

const InterviewStart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [interview, setInterview] = useState(null);
  const [name, setName] = useState("");
  const { setInterviewInfo } = useInterviewData();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })
  );

  const linkFromState =
    location.state?.link || `http://localhost:5173/interview/${id}`;
  const jobTitle =
    location.state?.interviewData?.jobTitle ||
    interview?.jobTitle ||
    "Interview";
  const duration =
    location.state?.interviewData?.duration || interview?.duration || "15 Min";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })
      );
    }, 1000);

    const updateInterviewInfo = (data) => {
      let questionsArray = [];
      if (data?.questions) {
        try {
          // Log the raw JSON string for debugging
          console.log("Raw questions JSON:", data.questions);

          // Attempt to parse the JSON
          const parsedQuestions = JSON.parse(data.questions);

          // Validate the parsed JSON structure
          if (
            !parsedQuestions.question ||
            !Array.isArray(parsedQuestions.question)
          ) {
            throw new Error(
              "Invalid JSON structure: 'question' array not found"
            );
          }

          // Extract question text
          questionsArray = parsedQuestions.question
            .map((q) => {
              if (!q.text) {
                console.warn("Question missing text:", q);
                return null;
              }
              return q.text;
            })
            .filter(Boolean) // Remove null/undefined entries
            .slice(0, 5); // Limit to 5 questions for a 15-minute interview

          console.log("Parsed questions:", questionsArray);
        } catch (e) {
          console.error("Error parsing questions JSON:", e.message);
          console.log("Raw questions string:", data.questions);

          // Fallback: Try to handle as a plain string or malformed JSON
          try {
            questionsArray = data.questions
              .split("\n")
              .map((q) => q.trim())
              .filter(
                (q) =>
                  q && q !== "," && !q.startsWith("{") && !q.startsWith("}")
              )
              .slice(0, 5); // Limit to 5 questions
            console.log("Fallback questions:", questionsArray);
          } catch (fallbackError) {
            console.error("Fallback parsing failed:", fallbackError.message);
            questionsArray = []; // Ensure empty array if all parsing fails
          }
        }
      } else {
        console.warn("No questions found in data:", data);
      }

      // Update context with parsed data
      setInterviewInfo((prev) => {
        const updatedInfo = {
          ...prev,
          userName: prev.userName || name || data?.createdBy || "Candidate",
          interviewData: {
            ...prev.interviewData,
            jobTitle: data?.jobTitle || jobTitle,
            duration: data?.duration || duration,
            questionList: questionsArray,
          },
        };
        console.log("Updated interviewInfo:", updatedInfo);
        return updatedInfo;
      });
    };

    if (!location.state?.interviewData) {
      fetch(`http://localhost:8080/api/interviews/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401) {
              navigate("/login", { state: { from: `/interview-start/${id}` } });
              throw new Error("Unauthorized: Please log in.");
            } else if (res.status === 404) {
              throw new Error("Interview not found.");
            }
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("API Response:", data);
          setInterview(data);
          updateInterviewInfo(data);
        })
        .catch((err) => {
          console.error("Error fetching interview:", err.message);
          if (err.message.includes("Unauthorized")) {
            setInterview({ error: "Please log in to view this interview." });
          } else if (err.message.includes("Interview not found")) {
            setInterview({ error: "Interview not found." });
          }
        });
    } else {
      setInterview(location.state.interviewData);
      updateInterviewInfo(location.state.interviewData);
    }

    return () => clearInterval(timer);
  }, [id, location.state, navigate, name, setInterviewInfo]);

  const handleJoin = () => {
    if (name.trim()) {
      setInterviewInfo((prev) => ({
        ...prev,
        userName: name,
      }));
      navigate(`/interview/${id}/start?name=${encodeURIComponent(name)}`);
    }
  };

  if (!interview && !location.state?.interviewData) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl w-full text-center">
        <div className="mb-6 flex items-center justify-center w-full">
          <img
            src={photo}
            alt="Interview Illustration"
            className="w-full h-auto rounded-lg object-cover max-h-64"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/192";
            }}
          />
        </div>

        <h1 className="text-2xl font-semibold text-blue-600 mb-1">
          Voicruiter
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          AI-Powered Interview Platform
        </p>

        <h2 className="text-xl font-medium text-gray-800">{jobTitle}</h2>
        <p className="text-sm text-gray-600 flex items-center justify-center gap-2 mt-1">
          ⏱ {duration}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Current Time: {currentTime} IST
        </p>

        {interview?.error ? (
          <p className="text-red-500 mt-4">{interview.error}</p>
        ) : (
          <>
            <div className="mt-6 text-left">
              <label className="text-sm text-gray-600 block mb-1">
                Enter your full name
              </label>
              <input
                type="text"
                placeholder="e.g. John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-6 text-left bg-blue-50 border border-blue-200 p-4 rounded-md text-sm text-blue-800">
              <p>📷 Test your camera and microphone</p>
              <p>🌐 Ensure a stable internet connection</p>
              <p>🤫 Find a quiet place for the interview</p>
            </div>

            <button
              onClick={handleJoin}
              disabled={!name.trim()}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
            >
              Join Interview
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewStart;
