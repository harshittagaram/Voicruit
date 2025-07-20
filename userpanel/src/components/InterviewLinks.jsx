import React from "react";

const InterviewLinks = ({ interviews }) => {
  const handleCopy = (id) => {
    const url = `${window.location.origin}/interview/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const handleSend = (id) => {
    const url = `${window.location.origin}/interview/${id}`;
    alert(`Sending interview link: ${url}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {interviews.map((interview) => (
        <div
          key={interview.id}
          className="bg-white p-4 rounded-xl shadow flex flex-col justify-between hover:shadow-lg transition-shadow"
        >
          <div>
            <p className="text-blue-600 font-medium mb-1">
              {interview.jobTitle}
            </p>
            <p className="text-gray-500 text-sm">{interview.duration} Min</p>
            <p className="text-gray-400 text-xs mt-2">
              {new Date(interview.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm py-1 px-3 rounded"
              onClick={() => handleCopy(interview.id)}
            >
              Copy Link
            </button>
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
              onClick={() => handleSend(interview.id)}
            >
              Send
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterviewLinks;
