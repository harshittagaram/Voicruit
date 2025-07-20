import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; // Import ClipLoader

const InterviewForm = ({
  form,
  onChange,
  onTypeToggle,
  onSuccess,
  onError,
  isGenerating,
  setIsGenerating,
  interviewTypes,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.jobTitle ||
      !form.description ||
      !form.selectedType ||
      !form.userName
    ) {
      toast.error(
        "❌ Please fill all required fields, including candidate name."
      );
      onError("Please fill all required fields.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/interviews",
        {
          jobTitle: form.jobTitle,
          description: form.description,
          duration: form.duration,
          interviewType: form.selectedType,
          userName: form.userName,
        },
        { withCredentials: true }
      );

      const { interviewData, questions } = response.data;

      let parsedQuestions;
      try {
        const questionsString = questions.join("");
        const questionsJson = JSON.parse(questionsString);
        parsedQuestions = questionsJson.question;
      } catch (parseError) {
        console.error("Error parsing questions:", parseError);
        throw new Error("Failed to parse questions from API response");
      }

      onSuccess({ interviewData, questions: parsedQuestions });
      toast.success("✅ Interview created and questions generated!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error in submission:", errorMessage);
      toast.error(`❌ Failed: ${errorMessage}`);
      onError(`Failed to create interview: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="jobTitle"
          >
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={form.jobTitle}
            onChange={onChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Software Engineer"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="userName"
          >
            Candidate Name
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={form.userName}
            onChange={onChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., John Smith"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="description"
          >
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the job description"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Interview Type
          </label>
          <div className="flex flex-wrap gap-2">
            {interviewTypes.map((type) => (
              <button
                key={type.label}
                type="button"
                onClick={() => onTypeToggle(type.label)}
                className={`px-4 py-2 rounded-md ${
                  form.selectedType === type.label
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="duration"
          >
            Duration
          </label>
          <select
            id="duration"
            name="duration"
            value={form.duration}
            onChange={onChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="15 minutes">15 minutes</option>
            <option value="30 minutes">30 minutes</option>
            <option value="45 minutes">45 minutes</option>
            <option value="60 minutes">60 minutes</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full p-2 rounded-md flex items-center justify-center ${
            isGenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isGenerating ? (
            <>
              <ClipLoader size={20} color="#ffffff" className="mr-2" />
              Generating...
            </>
          ) : (
            "Generate Interview"
          )}
        </button>
      </form>
    </div>
  );
};

export default InterviewForm;
