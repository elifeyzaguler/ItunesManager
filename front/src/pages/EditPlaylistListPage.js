import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditPlaylistListPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
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

  const handleAddPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error("Playlist name cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/playlists/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newPlaylistName }),
      });

      if (!response.ok) {
        throw new Error("Failed to add playlist");
      }

      const newPlaylist = await response.json();
      setPlaylists((prev) => [...prev, newPlaylist]);
      setNewPlaylistName("");
      setIsModalOpen(false);
      toast.success("Playlist added successfully!");
    } catch (error) {
      console.error("Error adding playlist:", error);
      toast.error("Error adding playlist. Please try again.");
    }
  };

  const handleEditPlaylist = (playlistId) => {
    navigate(`/edit-playlist/${playlistId}`);
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
      <div className="w-full max-w-6xl flex justify-start mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-400 text-white font-bold rounded shadow-lg hover:from-green-600 hover:to-green-500 transition"
        >
          Add Playlist
        </button>
      </div>

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
              onClick={() => handleEditPlaylist(playlist.playlist_id)}
              className="px-4 py-2 bg-white text-gray-800 font-bold rounded shadow-lg hover:bg-gray-100 transition"
            >
              Edit Playlist
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Playlist</h2>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter playlist name"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlaylist}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPlaylistListPage;
