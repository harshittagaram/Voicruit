import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        setError("Failed to load user details.");
        toast.error("Failed to load user details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-1 p-6 md:ml-64">
          <div className="text-gray-600 text-lg font-medium animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-1 p-6 md:ml-64">
          <div className="text-red-600 text-lg font-medium">
            {error || "No user data available."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen bg-gray-50 flex-1 p-6 md:ml-64">
        <div className="max-w-lg mx-auto mt-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Account Settings
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                  {user.name || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                  {user.email || "N/A"}
                </div>
              </div>
              <div className="pt-4">
                <a
                  href="http://localhost:8080/logout"
                  className="block w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg text-center font-medium text-base transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Logout"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
