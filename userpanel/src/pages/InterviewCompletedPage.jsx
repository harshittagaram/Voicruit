import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Import Sidebar

function InterviewCompleted() {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <Sidebar /> {/* Add Sidebar */}
      <div className="p-6 md:ml-64 bg-gray-100 min-h-screen flex-1">
        {" "}
        {/* Adjust content */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Interview Completed
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
          <p className="text-gray-600 mb-4">
            Thank you for completing the interview! Your feedback has been
            submitted.
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewCompleted;
