import React from "react";
import axios from "axios";

const InterviewForm = ({
  form,
  onChange,
  onTypeToggle,
  interviewTypes,
  isGenerating,
  onSuccess,
  onError,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.jobTitle || !form.description || !form.selectedType) {
      onError("Please fill all required fields.");
      alert("❌ Please fill all required fields.");
      return;
    }

    try {
      const payload = {
        jobTitle: form.jobTitle,
        description: form.description,
        duration: form.duration,
        type: form.selectedType,
      };
      console.log("Sending payload to backend:", payload); 

      const response = await axios.post(
        "http://localhost:8080/api/interviews",
        payload,
        {
          withCredentials: true,
        }
      );

      console.log("Backend response:", response.data); 
      alert("✅ Form submitted successfully! Interview data saved."); 

      onSuccess({
        jobTitle: form.jobTitle,
        type: form.selectedType,
        duration: form.duration,
        link: response.data.link || "https://voicruit.com/interview/abc123",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error creating interview:", errorMessage, error);
      alert(`❌ Failed to submit form: ${errorMessage}`); 
      onError(`Failed to create interview: ${errorMessage}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-6 max-w-3xl"
    >
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Questions →"}
        </button>
      </div>
    </form>
  );
};

export default InterviewForm;
