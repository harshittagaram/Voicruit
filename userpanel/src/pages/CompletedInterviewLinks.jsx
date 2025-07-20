import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // adjust the path if needed
import InterviewCardsSimple from "../components/InterviewLinks"; // this should match the file you saved earlier

const CompletedInterviewLinks = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/interviews/my", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch interviews");
        return res.json();
      })
      .then((data) => {
        const completed = data.filter((interview) => interview.feedback); // ✅ Only keep interviews with feedback
        setInterviews(completed);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching interviews:", error);
        setLoading(false);
      });
  }, []);


  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 text-green-700">
          Completed Interview Links
        </h1>
        {loading ? (
          <p className="text-gray-500">Loading interviews...</p>
        ) : interviews.length > 0 ? (
          <InterviewCardsSimple interviews={interviews} />
        ) : (
          <p className="text-gray-500">No interviews found.</p>
        )}
      </div>
    </div>
  );
};

export default CompletedInterviewLinks;
