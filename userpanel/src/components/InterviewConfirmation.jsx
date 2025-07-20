import React from "react";
import { useNavigate } from "react-router-dom";

const InterviewConfirmation = ({
  interview,
  onBackToDashboard,
  onCreateNew,
}) => {
  const navigate = useNavigate();
  const interviewLink = interview?.id
    ? `http://localhost:5173/interview/${interview.id}`
    : "#";
  const duration = interview?.duration || "15 minutes"; // Use interview.duration
  const questionCount = Array.isArray(interview?.questions)
    ? interview.questions.length
    : 0; // Safely access questions length
  // Calculate expiry date: 7 days from createdAt or current date
  const createdAt = interview?.createdAt
    ? new Date(interview.createdAt)
    : new Date();
  const expiryDate = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 7 days
  const formattedExpiryDate = expiryDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleCopy = () => {
    if (interview?.id) {
      navigator.clipboard.writeText(interviewLink);
      alert("Link copied to clipboard!");
    } else {
      alert("Interview link is not available.");
    }
  };

  const handleStartInterview = () => {
    if (interview?.id) {
      navigate(`/interview/${interview.id}`, {
        state: { link: interviewLink, interviewData: interview },
      });
    } else {
      alert("Interview data is not available to start.");
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow space-y-6 text-center">
      <div className="text-green-600 text-4xl">✅</div>
      <h2 className="text-2xl font-bold text-gray-800">
        Your AI Interview is Ready!
      </h2>

      <p className="text-gray-700 text-sm">
        Interview Link:
        <a
          href={interviewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-medium ml-2 underline"
          onClick={(e) => {
            e.preventDefault();
            handleStartInterview();
          }}
        >
          {interviewLink}
        </a>
      </p>

      <div className="bg-gray-100 p-4 rounded-xl border text-left space-y-2">
        <div className="flex items-center justify-between">
          <p className="break-all text-gray-800">{interviewLink}</p>
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700"
            onClick={handleCopy}
            disabled={!interview?.id}
          >
            Copy Link
          </button>
        </div>
        <div className="text-sm text-gray-600 flex flex-wrap gap-4 pt-2">
          <span>📅 {duration}</span>
          <span>❓ {questionCount} Questions</span>
          <span>⏳ Expires: {formattedExpiryDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2">
        <button
          className="bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
          onClick={() => alert("Email functionality to be implemented")}
        >
          📧 Email
        </button>
        <button
          className="bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
          onClick={() => alert("Slack functionality to be implemented")}
        >
          💬 Slack
        </button>
        <button
          className="bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
          onClick={() => alert("WhatsApp functionality to be implemented")}
        >
          📱 WhatsApp
        </button>
      </div>

      <div className="flex justify-between pt-6">
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => navigate("/dashboard")} // Navigate to /dashboard
          disabled={!interview?.id}
        >
          ← Back to Dashboard
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={onCreateNew}
          disabled={!interview?.id}
        >
          + Create New Interview
        </button>
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={handleStartInterview}
          disabled={!interview?.id}
        >
          Start Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewConfirmation;
