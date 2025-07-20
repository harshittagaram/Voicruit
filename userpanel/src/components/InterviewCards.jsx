import React from "react";
import { useNavigate } from "react-router-dom";

const InterviewCards = ({ interviews }) => {
  const navigate = useNavigate();

  const handleCardClick = (interview) => {
    // Navigate to InterviewDetailsPage with interview data
    navigate(`/details/${interview.id}`, {
      state: { interview },
    });
  };

  // ✅ Filter only interviews that have feedback
  const completedInterviews = interviews.filter(
    (interview) => interview.feedback
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {completedInterviews.map((interview) => (
        <div
          key={interview.id}
          className="bg-white p-4 rounded-xl shadow flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(interview)}
        >
          <div>
            <p className="text-blue-600 font-medium mb-1">
              {interview.jobTitle}
            </p>
            <p className="text-gray-500 text-sm">{interview.duration} Min</p>
            <p className="text-gray-400 text-xs mt-2">
              {new Date(interview.createdAt || Date.now()).toLocaleDateString()}
            </p>
            <p className="text-green-600 text-xs mt-1">Feedback Available</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterviewCards;
