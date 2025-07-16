import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

const InterviewRoom = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "Candidate";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">
        AI Interview Session
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center w-64 h-64 justify-center">
          <img
            src="https://randomuser.me/api/portraits/women/65.jpg"
            alt="AI Recruiter"
            className="w-20 h-20 rounded-full mb-2 object-cover"
          />
          <p className="text-gray-800 font-medium mt-2">AI Recruiter</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center w-64 h-64 justify-center">
          <div className="bg-blue-600 text-white w-14 h-14 flex items-center justify-center text-lg rounded-full mb-2">
            {name.charAt(0).toUpperCase()}
          </div>
          <p className="text-gray-800 font-medium mt-2">{name}</p>
        </div>
      </div>

      <div className="mt-6 text-gray-700 text-sm">
        <span className="inline-flex items-center gap-1">
          ⏱ Timer: <span className="font-mono">00:00:00</span>
        </span>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800">
          🎙️
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">
          ❌
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-6">Interview in Progress…</p>
    </div>
  );
};

export default InterviewRoom;
