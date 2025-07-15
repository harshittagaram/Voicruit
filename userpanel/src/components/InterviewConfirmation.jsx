import React from "react";

const InterviewConfirmation = ({ interview }) => {
  return (
    <div className="max-w-2xl bg-white p-6 rounded-xl shadow text-center space-y-4">
      <h2 className="text-2xl font-bold text-green-600">
        ✅ Interview Created!
      </h2>
      <p className="text-gray-700">
        Job Title: <strong>{interview.jobTitle}</strong>
      </p>
      <p className="text-gray-700">Duration: {interview.duration}</p>
      <p className="text-gray-700">Type: {interview.selectedType}</p>
      <p className="text-sm text-gray-400">
        You can now copy or share the interview link from your dashboard.
      </p>
    </div>
  );
};

export default InterviewConfirmation;
