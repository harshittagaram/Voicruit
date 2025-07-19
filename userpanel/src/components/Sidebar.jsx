import React from "react";
import { Link } from "react-router-dom";


const Sidebar = () => {
  return (
    <aside className="w-64 bg-white p-6 shadow-lg min-h-screen">
      <Link to="/dashboard">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">Voicruiter</h2>
      </Link>

      <a
        href="/create-interview"
        className="w-full bg-blue-600 text-white py-2 rounded-lg mb-6 hover:bg-blue-700 text-center block"
      >
        + Create New Interview
      </a>

      <nav className="space-y-4 text-gray-700">
        <Link to="/dashboard" className="block hover:text-blue-600 font-medium">
          Dashboard
        </Link>
        <a href="#" className="block hover:text-blue-600">
          Scheduled Interview
        </a>
        <Link to="/all-interviews" className="block hover:text-blue-600">
          Your Past Interviews
        </Link>

        <a href="#" className="block hover:text-blue-600">
          Billing
        </a>
        <a href="#" className="block hover:text-blue-600">
          Settings
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
