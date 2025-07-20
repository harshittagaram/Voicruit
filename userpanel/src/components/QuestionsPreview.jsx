// src/components/QuestionsPreview.jsx
import React from "react";

const QuestionsPreview = ({ interviewData, questions, onBack, onConfirm }) => {
  console.log("Questions Prop:", questions); // Debug to confirm the prop

  return (
    <div className="max-w-3xl bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        🧠 AI-Generated Questions
      </h2>

      {Array.isArray(questions) && questions.length > 0 ? (
        <ul className="space-y-4">
          {questions.map((q, idx) => (
            <li
              key={idx}
              className="bg-gray-50 border-l-4 border-blue-500 shadow-sm p-4 rounded-md"
            >
              <div className="text-sm text-blue-600 font-semibold mb-1">
                🔹 {q.type || "Unknown Type"}
              </div>
              <div className="text-gray-800 text-base">
                {q.text || "No question text available"}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 italic">
          No questions available to preview.
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-gray-200 mt-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={onBack}
        >
          ← Edit
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          onClick={onConfirm}
          disabled={!Array.isArray(questions) || questions.length === 0}
        >
          Generate Interview →
        </button>
      </div>
    </div>
  );
};

export default QuestionsPreview;
