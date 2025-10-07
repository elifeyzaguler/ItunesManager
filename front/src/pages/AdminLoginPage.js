import React, { useState } from "react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showBubble, setShowBubble] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      alert("Login Successful! Press OK to go to Admin Dashboard... ");
      window.location.href = "/admin-dashboard";
    } else {
      setError("(Username: admin , Password: admin)");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Access the Admin Dashboard
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Need help?{" "}
            <button
              onClick={() => setShowBubble(true)}
              className="text-purple-500 hover:underline focus:outline-none"
            >
              Get Help
            </button>
          </p>
          {showBubble && (
            <div className="mt-4 p-4 bg-gray-100 border-l-4 border-purple-500 text-purple-700 rounded-lg relative">
              <p>Username: admin</p>
              <p>Password: admin</p>
              <button
                onClick={() => setShowBubble(false)}
                className="absolute top-2 right-2 text-purple-700 hover:text-purple-800 focus:outline-none"
              >
                ✖
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
