import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import InterviewCards from "../components/InterviewCards"; // 👈 import it
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => {
        setUser(null);
        window.location.href = "/login";
      });

    // fetch interviews
    axios
      .get("http://localhost:8080/api/interviews/my", { withCredentials: true })
      .then((res) => setInterviews(res.data))
      .catch(() => setInterviews([]));
  }, []);

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10">
        <PageHeader name={user.name} />

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <Link to="/create-interview">
              <h2 className="text-lg font-semibold mb-2">
                🎥 Create New Interview
              </h2>
            </Link>
            <p className="text-gray-500 text-sm">
              Create AI interviews and schedule them with candidates
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">
              📞 Create Phone Screening Call
            </h2>
            <p className="text-gray-500 text-sm">
              Schedule phone screening calls with potential candidates
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4">
            Previously Created Interviews
          </h3>
          <InterviewCards interviews={interviews} />
        </section>

        <div className="mt-10">
          <a
            href="http://localhost:8080/logout"
            className="inline-block text-sm text-red-600 hover:underline"
          >
            Logout
          </a>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
