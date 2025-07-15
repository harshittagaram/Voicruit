// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";


const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/user", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => {
        setUser(null);
        window.location.href = "/login";
      });
  }, []);

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-10">
        <PageHeader name={user.name} />

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">
              🎥 Create New Interview
            </h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow flex flex-col justify-between"
              >
                <div>
                  <p className="text-blue-600 font-medium mb-1">
                    Full Stack Developer
                  </p>
                  <p className="text-gray-500 text-sm">30 Min</p>
                  <p className="text-gray-400 text-xs mt-2">20 Oct 2024</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm py-1 px-3 rounded">
                    Copy Link
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded">
                    Send
                  </button>
                </div>
              </div>
            ))}
          </div>
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
