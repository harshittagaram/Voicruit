// src/components/QuestionsPreview.jsx
import React from "react";

const QuestionsPreview = ({ interviewData, questions, onBack, onConfirm }) => {
  return (
    <div className="max-w-3xl bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-semibold">🧠 AI-Generated Questions</h2>
      {questions && questions.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700">
          {questions.map((q, idx) => (
            <li key={idx}>{q}</li>
          ))}
        </ul>
      ) : (
        <div>QuestionList</div>
      )}

      <div className="flex justify-between pt-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={onBack}
        >
          ← Edit
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={onConfirm}
          disabled={questions.length === 0}
        >
          Generate Interview →
        </button>
      </div>
    </div>
  );
};

export default QuestionsPreview;
