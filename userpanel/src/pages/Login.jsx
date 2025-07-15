import React from "react";

const Login = () => {
  const handleLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Login</h1>

        <button
          onClick={() => handleLogin("google")}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Continue with Google
        </button>

        <button
          onClick={() => handleLogin("github")}
          className="w-full bg-gray-800 hover:bg-black text-white py-2 px-4 rounded-lg transition-colors"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
