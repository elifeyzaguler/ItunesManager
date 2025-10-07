import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [data, setData] = useState({
    tracks: 0,
    artists: 0,
    albums: 0,
    customers: 0,
    playlists: 0,
    employees: 0,
    invoices: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/stats");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Unknown error");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex flex-col items-center p-6">
      <header className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 leading-snug">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Manage the music database, view statistics, and maintain system.
        </p>
      </header>

      <section
        id="statistics"
        className="w-full max-w-6xl mt-16 bg-white rounded-2xl shadow-2xl p-10"
      >
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Overview
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 bg-gradient-to-tr from-blue-500 to-blue-400 text-white rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-semibold mb-4">Tracks</h3>
            <p className="text-5xl font-bold">{data.tracks}</p>
            <button
              onClick={() => navigate("/edit-tracks")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              ✏️ Edit Tracks
            </button>
          </div>
          <div className="p-8 bg-gradient-to-tr from-green-500 to-green-400 text-white rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-semibold mb-4">Artists</h3>
            <p className="text-5xl font-bold">{data.artists}</p>
            <button
              onClick={() => navigate("/edit-artists")}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              ✏️ Edit Artists
            </button>
          </div>
          <div className="p-8 bg-gradient-to-tr from-purple-500 to-purple-400 text-white rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-semibold mb-4">Albums</h3>
            <p className="text-5xl font-bold">{data.albums}</p>
            <button
              onClick={() => navigate("/edit-albums")}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              ✏️ Edit Albums
            </button>
          </div>
          <div className="p-8 bg-gradient-to-tr from-yellow-500 to-yellow-400 text-white rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-semibold mb-4">Playlists</h3>
            <p className="text-5xl font-bold">{data.playlists}</p>
            <button
              onClick={() => navigate("/playlists-admin")}
              className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
            >
              ✏️ Edit Playlists
            </button>
          </div>
          <div className="p-8 bg-gradient-to-tr from-red-500 to-red-400 text-white rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-semibold mb-4">Customers</h3>
            <p className="text-5xl font-bold">{data.customers}</p>
            <button
              onClick={() => navigate("/edit-customers")}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              ✏️ Edit Customers
            </button>
          </div>

          <div className="p-8 bg-gradient-to-tr from-teal-500 to-teal-400 text-white rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-semibold mb-4">Employees</h3>
            <p className="text-5xl font-bold">{data.employees}</p>
            <button
              onClick={() => navigate("/edit-employees")}
              className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded"
            >
              ✏️ Edit Employees
            </button>
          </div>
        </div>
      </section>

      <footer className="w-full max-w-6xl mt-16 bg-white rounded-2xl shadow-2xl p-8 text-center">
        <p className="text-gray-600">
          © 2024 Elif Feyza Güler. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
