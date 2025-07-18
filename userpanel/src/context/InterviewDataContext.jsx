// src/context/InterviewDataContext.js (adjust path as needed)

import React, { createContext, useState, useContext } from "react";

// Create the context
const InterviewDataContext = createContext();

// Provider component
export const InterviewDataProvider = ({ children }) => {
  const [interviewInfo, setInterviewInfo] = useState({
    userName: "", // Default empty, to be set from props or searchParams
    interviewData: {
      questionList: [], // Array of question objects, e.g., { question: "..." }
    },
  });

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      {children}
    </InterviewDataContext.Provider>
  );
};

// Custom hook to use the context
export const useInterviewData = () => {
  const context = useContext(InterviewDataContext);
  if (!context) {
    throw new Error(
      "useInterviewData must be used within an InterviewDataProvider"
    );
  }
  return context;
};

export default InterviewDataContext;
