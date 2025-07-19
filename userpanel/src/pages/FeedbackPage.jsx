// src/components/FeedbackPage.js
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function FeedbackPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.feedback) {
      navigate("/"); // go to home or a safe page
    }
  }, [location, navigate]);

  const feedback = location.state?.feedback;
  if (!feedback) {
    return (
      <div className="p-6 text-center text-gray-500">
        No feedback available.
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Interview Feedback
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Ratings</h2>
        <p>Technical Skills: {feedback.technicalSkills}/10</p>
        <p>Communication: {feedback.communication}/10</p>
        <p>Problem Solving: {feedback.problemSolving}/10</p>
        <p>Experience: {feedback.experience}/10</p>

        <h2 className="text-xl font-medium text-gray-700 mt-6 mb-2">Summary</h2>
        {feedback.summary?.map((line, index) => (
          <p key={index} className="text-gray-600">
            {line || "N/A"}
          </p>
        )) || <p className="text-gray-500">No summary available.</p>}

        <h2 className="text-xl font-medium text-gray-700 mt-6 mb-2">
          Recommendation
        </h2>
        <p>Recommended: {feedback.recommendation}</p>
        <p>{feedback.recommendationMsg}</p>
      </div>
    </div>
  );
}

export default FeedbackPage;
