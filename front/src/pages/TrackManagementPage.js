import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const TrackManagementPage = () => {
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 5;
  const [newTrack, setNewTrack] = useState({
    track_name: null,
    album_id: null,
    mediaTypeId: null,
    genreId: null,
    composer: null,
    seconds: null,
    unit_price: null,
  });
  const [editTrack, setEditTrack] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/tracks");
      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }
      const data = await response.json();
      setTracks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/albums");
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      const data = await response.json();
      setAlbums(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTracks();
    fetchAlbums();
  }, []);

  const filteredTracks = tracks.filter((track) =>
    (track.track_name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const indexOfLastTrack = currentPage * tracksPerPage;
  const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
  const currentTracks = filteredTracks.slice(
    indexOfFirstTrack,
    indexOfLastTrack
  );

  const totalPages = Math.ceil(filteredTracks.length / tracksPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddTrack = async (e) => {
    e.preventDefault();
    if (!newTrack.track_name || !newTrack.unit_price) {
      alert("Name and Unit Price are required.");
      return;
    }
    const trackToAdd = {
      ...newTrack,
      unit_price: parseFloat(newTrack.unit_price),
      seconds: parseInt(newTrack.seconds, 10),
    };
    try {
      const response = await fetch("http://localhost:3000/api/tracks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackToAdd),
      });
      if (!response.ok) {
        throw new Error("Failed to add track");
      }
      toast.success("Track added successfully!", { duration: 2000 });
      await fetchTracks();
      setNewTrack({
        track_name: null,
        album_id: null,
        mediaTypeId: null,
        genreId: null,
        composer: null,
        seconds: null,
        unit_price: null,
      });
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error(err.message, { duration: 2000 });
    }
  };

  const handleEditTrack = async (e) => {
    e.preventDefault();
    console.log(editTrack);
    try {
      const response = await fetch(
        `http://localhost:3000/api/tracks/update/${editTrack.track_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editTrack),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit track");
      }
      toast.success("Track updated successfully!", { duration: 2000 });
      await fetchTracks();
      setEditTrack(null);
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err.message, { duration: 2000 });
    }
  };

  const handleDeleteTrack = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tracks/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete track");
      }
      toast.success("Track deleted successfully!", { duration: 2000 });
      fetchTracks();
      setSearchQuery("");
    } catch (err) {
      toast.error(err.message, { duration: 2000 });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="absolute top-6 right-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
      >
        Add New Track
      </button>
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 mt-10">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Manage Tracks
        </h1>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <ul className="space-y-4">
          {currentTracks.map((track) => (
            <li
              key={track.id}
              className="p-4 bg-gray-200 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{track.track_name}</p>
                <p className="text-sm">Album: {track.album_title}</p>
                <p className="text-sm">Price: ${track.unit_price}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditTrack(track);
                    setIsEditModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTrack(track.track_id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 transition"
            }`}
          >
            Previous
          </button>
          <p className="text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 transition"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Add New Track
            </h2>
            <form onSubmit={handleAddTrack}>
              <label>Track Title</label>
              <input
                type="text"
                value={newTrack.track_name || ""}
                onChange={(e) =>
                  setNewTrack({ ...newTrack, track_name: e.target.value })
                }
                placeholder="Track Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                required
              />

              <label>Album</label>
              <select
                value={newTrack.album_id || ""}
                onChange={(e) =>
                  setNewTrack({ ...newTrack, album_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>
                  Select Album
                </option>
                {albums.map((album) => (
                  <option key={album.album_id} value={album.album_id}>
                    {album.title}
                  </option>
                ))}
              </select>

              <label>Composer</label>
              <input
                type="text"
                value={newTrack.composer || ""}
                onChange={(e) =>
                  setNewTrack({ ...newTrack, composer: e.target.value })
                }
                placeholder="Composer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
              />

              <label>Unit Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newTrack.unit_price || ""}
                onChange={(e) =>
                  setNewTrack({ ...newTrack, unit_price: e.target.value })
                }
                placeholder="Unit Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editTrack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Track</h2>
            <form onSubmit={handleEditTrack}>
              <label>Track Title</label>
              <input
                type="text"
                value={editTrack.track_name || ""}
                onChange={(e) =>
                  setEditTrack({ ...editTrack, track_name: e.target.value })
                }
                placeholder="Track Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <label>Album</label>
              <select
                value={editTrack.album_id || 0}
                onChange={(e) =>
                  setEditTrack({ ...editTrack, album_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>
                  Select Album
                </option>
                {albums.map((album) => (
                  <option key={album.album_id} value={album.album_id}>
                    {album.title}
                  </option>
                ))}
              </select>
              <label>Composer</label>
              <input
                type="text"
                value={editTrack.composer || ""}
                onChange={(e) =>
                  setEditTrack({ ...editTrack, composer: e.target.value })
                }
                placeholder="Composer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
              />
              <label>Unit Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editTrack.unit_price}
                onChange={(e) =>
                  setEditTrack({ ...editTrack, unit_price: e.target.value })
                }
                placeholder="Unit Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                required
              />

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackManagementPage;
