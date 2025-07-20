import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const InterviewForm = ({
  form,
  onChange,
  onTypeToggle,
  interviewTypes,
  isGenerating,
  onSuccess,
  onError,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

 const handleSubmit = async (e) => {
   e.preventDefault();

   if (!form.jobTitle || !form.description || !form.selectedType) {
     toast.error("❌ Please fill all required fields.");
     onError("Please fill all required fields.");
     return;
   }

   setIsSubmitted(true);

   try {
     const response = await axios.post(
       "http://localhost:8080/api/interviews",
       {
         jobTitle: form.jobTitle,
         description: form.description,
         duration: form.duration,
         interviewType: form.selectedType,
       },
       { withCredentials: true }
     );

     const { interviewData, questions } = response.data;

     // Parse the questions array, which is currently an array of JSON fragments
     let parsedQuestions;
     try {
       // Join the array of strings and parse as JSON, extracting the 'question' array
       const questionsString = questions.join("");
       const questionsJson = JSON.parse(questionsString);
       parsedQuestions = questionsJson.question; // Extract the 'question' array
     } catch (parseError) {
       console.error("Error parsing questions:", parseError);
       throw new Error("Failed to parse questions from API response");
     }
     console.log("Parsed Questions:", parsedQuestions);
     onSuccess({ interviewData, questions: parsedQuestions });

     toast.success("✅ Interview created and questions generated!");
   } catch (error) {
     const errorMessage = error.response?.data?.message || error.message;
     console.error("Error in submission:", errorMessage);
     toast.error(`❌ Failed: ${errorMessage}`);
     onError(`Failed to create interview: ${errorMessage}`);
     setIsSubmitted(false);
   }
 };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-6 max-w-3xl"
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div>
        <label className="block text-gray-700 mb-1">Job Position</label>
        <input
          type="text"
          name="jobTitle"
          value={form.jobTitle}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-lg p-2"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-lg p-2"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Duration</label>
        <select
          name="duration"
          value={form.duration}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option>15 minutes</option>
          <option>30 minutes</option>
          <option>45 minutes</option>
          <option>60 minutes</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Interview Types</label>
        <div className="flex flex-wrap gap-3">
          {interviewTypes.map((type) => (
            <button
              type="button"
              key={type.label}
              onClick={() => onTypeToggle(type.label)}
              className={`flex items-center gap-1 border px-3 py-1.5 rounded-full text-sm ${
                form.selectedType === type.label
                  ? "bg-blue-100 text-blue-600 border-blue-400"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <span>{type.icon}</span> {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200
            ${
              isGenerating || isSubmitted
                ? "bg-blue-300 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
          disabled={isGenerating || isSubmitted}
        >
          {isGenerating ? (
            <>
              <FaSpinner className="animate-spin" /> Generating...
            </>
          ) : (
            "Generate Questions →"
          )}
        </button>
      </div>
    </form>
  );
};

export default InterviewForm;
