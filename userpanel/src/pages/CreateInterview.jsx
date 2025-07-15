import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import InterviewForm from "../components/InterviewForm";
import QuestionsPreview from "../components/QuestionsPreview";
import InterviewConfirmation from "../components/InterviewConfirmation";

const interviewTypes = [
  { label: "Technical", icon: "💻" },
  { label: "Behavioral", icon: "🧠" },
  { label: "Experience", icon: "📜" },
  { label: "Problem Solving", icon: "🧩" },
  { label: "Leadership", icon: "👑" },
];

const CreateInterview = () => {
  const [form, setForm] = useState({
    jobTitle: "",
    description: "",
    duration: "15 minutes",
    selectedType: null,
  });

  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [interviewData, setInterviewData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleType = (type) => {
    setForm((prev) => ({
      ...prev,
      selectedType: prev.selectedType === type ? null : type,
    }));
  };

  const handleFormSuccess = (interviewData) => {
    setGeneratedQuestions([
      `Why do you want the role of ${form.jobTitle}?`,
      `How do you handle challenges in ${form.selectedType} scenarios?`,
      `Explain a situation where your ${form.selectedType} skills were tested.`,
    ]);

    setInterviewData(interviewData);

    setStep(1);
    setIsGenerating(false);
  };

  const handleFormError = (errorMessage) => {
    alert(`❌ ${errorMessage}`);
    setIsGenerating(false);
  };

  const handleGenerateInterview = () => {
    setStep(2); 
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 md:ml-64 bg-gray-50 min-h-screen flex-1">
        <h1 className="text-2xl font-bold mb-4">📝 Create New Interview</h1>

        {step === 0 && (
          <InterviewForm
            form={form}
            onChange={handleChange}
            onTypeToggle={toggleType}
            onSuccess={handleFormSuccess}
            onError={handleFormError}
            isGenerating={isGenerating}
            interviewTypes={interviewTypes}
          />
        )}

        {step === 1 && (
          <QuestionsPreview
            questions={generatedQuestions}
            onBack={() => setStep(0)}
            onConfirm={handleGenerateInterview} 
          />
        )}

        {step === 2 && interviewData && (
          <InterviewConfirmation
            interview={interviewData}
            onStartNew={() => {
              setForm({
                jobTitle: "",
                description: "",
                duration: "15 minutes",
                selectedType: null,
              });
              setStep(0);
              setGeneratedQuestions([]);
              setInterviewData(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CreateInterview;
