import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // adjust the path as needed
import InterviewCards from "../components/InterviewCards";


const AllInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/interviews/my", {
      credentials: "include", // for OAuth cookie-based auth
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch interviews");
        return res.json();
      })
      .then((data) => {
        setInterviews(data);
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
        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          Your Interviews
        </h1>
        <InterviewCards interviews={interviews} />
      </div>
    </div>
  );
};

export default AllInterviews;
