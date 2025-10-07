import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/playlists");
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const handleViewPlaylist = (playlistId) => {
    navigate(`/playlists/${playlistId}`);
  };

  if (loading) {
    return <div>Loading playlists...</div>;
  }

  const colors = [
    "bg-gradient-to-tr from-purple-500 to-purple-400",
    "bg-gradient-to-tr from-orange-500 to-orange-400",
    "bg-gradient-to-tr from-pink-500 to-pink-400",
    "bg-gradient-to-tr from-teal-500 to-teal-400",
    "bg-gradient-to-tr from-blue-500 to-blue-400",
    "bg-gradient-to-tr from-yellow-500 to-yellow-400",
    "bg-gradient-to-tr from-red-500 to-red-400",
    "bg-gradient-to-tr from-green-500 to-green-400",
    "bg-gradient-to-tr from-indigo-500 to-indigo-400",
    "bg-gradient-to-tr from-cyan-500 to-cyan-400",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Playlists</h1>
      <div className="w-full max-w-6xl grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {playlists.map((playlist, index) => (
          <div
            key={playlist.id}
            className={`p-8 ${
              colors[index % colors.length]
            } text-white rounded-xl shadow-lg hover:scale-105 transition transform text-center flex flex-col justify-between`}
          >
            <h2 className="text-2xl font-semibold mb-4">{playlist.name}</h2>
            <button
              onClick={() => handleViewPlaylist(playlist.playlist_id)}
              className="px-4 py-2 bg-white text-gray-800 font-bold rounded shadow-lg hover:bg-gray-100 transition"
            >
              View Playlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsPage;
