import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar"; // Import Sidebar

function InterviewDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(location.state?.interview || null);
  const [loading, setLoading] = useState(!location.state?.interview);
  const [error, setError] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    if (!interview) {
      const fetchInterview = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/interviews/${id}`,
            {
              withCredentials: true,
            }
          );
          setInterview(response.data);
        } catch (err) {
          setError("Failed to load interview details.");
          toast.error("Failed to load interview details.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchInterview();
    }
  }, [id, interview]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowFeedbackModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (error || !interview) {
    return (
      <div className="p-6 text-center text-gray-500">
        {error || "No interview details available."}
      </div>
    );
  }

  // Parse questions
  let questions = [];
  try {
    if (interview.questions) {
      if (typeof interview.questions === "string") {
        try {
          const questionsJson = JSON.parse(interview.questions);
          questions = questionsJson.question || questionsJson;
        } catch {
          const questionArray = interview.questions
            .split("\n")
            .filter((q) => q.trim());
          questions = questionArray.map((text) => ({
            type: "Technical",
            text,
          }));
        }
      } else if (Array.isArray(interview.questions)) {
        questions = interview.questions;
      }
    }
  } catch (err) {
    console.error("Error parsing questions:", err);
    questions = [];
  }

  // Parse feedback and calculate overallScore
  let feedback = null;
  try {
    if (interview.feedback) {
      feedback = JSON.parse(interview.feedback);
      if (feedback.ratings) {
        const ratings = [
          feedback.ratings.technicalSkills || 0,
          feedback.ratings.communication || 0,
          feedback.ratings.problemSolving || 0,
          feedback.ratings.experience || 0,
        ];
        const validRatings = ratings.filter((r) => r > 0);
        feedback.overallScore = validRatings.length
          ? Math.round(
              (validRatings.reduce((sum, r) => sum + r, 0) /
                validRatings.length) *
                10
            ) / 10
          : 0;
      }
      feedback.name = interview.userName || "Candidate";
      feedback.email = interview.createdBy || "No email provided";
    }
  } catch (err) {
    console.error("Error parsing feedback:", err);
    feedback = null;
  }

  const openFeedbackModal = () => setShowFeedbackModal(true);
  const closeFeedbackModal = () => setShowFeedbackModal(false);

  return (
    <div className="flex">
      <Sidebar /> {/* Add Sidebar */}
      <div className="p-6 md:ml-64 bg-gray-100 min-h-screen flex-1">
        {" "}
        {/* Adjust content with md:ml-64 */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Interview Details
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Details</h2>
          <p className="text-gray-600">
            <strong>Job Role:</strong> {interview.jobTitle || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Candidate Name:</strong> {interview.userName || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Duration:</strong> {interview.duration || "N/A"} Min
          </p>
          <p className="text-gray-600">
            <strong>Interview Type:</strong> {interview.interviewType || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Created Date:</strong>{" "}
            {new Date(interview.createdAt || Date.now()).toLocaleDateString()}
          </p>

          <h2 className="text-xl font-medium text-gray-700 mt-6 mb-2">
            Questions
          </h2>
          {Array.isArray(questions) && questions.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-600">
              {questions.map((q, idx) => (
                <li key={idx}>
                  {q.text || "No question text available"} (
                  {q.type || "Unknown Type"})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No questions available.</p>
          )}

          <div className="mt-6 flex gap-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              onClick={openFeedbackModal}
              disabled={!interview.feedback}
            >
              See Interview Feedback
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={() => navigate("/dashboard")}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
        {/* Feedback Modal */}
        {showFeedbackModal && feedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full mx-4 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold">
                  {feedback.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {feedback.name || "Unnamed"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {feedback.email || "No email provided"}
                  </p>
                </div>
                <div className="ml-auto text-xl font-bold text-blue-600">
                  {feedback.overallScore || "N/A"}/10
                </div>
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Skills Assessment
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      label: "Technical Skills",
                      value: feedback.ratings?.technicalSkills,
                    },
                    {
                      label: "Communication",
                      value: feedback.ratings?.communication,
                    },
                    {
                      label: "Problem Solving",
                      value: feedback.ratings?.problemSolving,
                    },
                    {
                      label: "Experience",
                      value: feedback.ratings?.experience,
                    },
                  ].map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{skill.label}</span>
                        <span>{skill.value || 0}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(skill.value || 0) * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Performance Summary
                </h3>
                {Array.isArray(feedback.summary) &&
                feedback.summary.length > 0 ? (
                  <div className="bg-gray-100 p-3 rounded-md space-y-2 text-sm text-gray-700">
                    {feedback.summary.map((item, idx) => (
                      <p key={idx}>• {item || "N/A"}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No summary available.</p>
                )}
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Recommendation
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Recommendation:</strong>{" "}
                  {feedback.recommendation || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Message:</strong>{" "}
                  {feedback.recommendationMsg || "No message available."}
                </p>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onClick={closeFeedbackModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewDetailsPage;
