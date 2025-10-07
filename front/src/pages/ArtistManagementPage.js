import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const ArtistManagementPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const artistsPerPage = 5;
  const [newArtist, setNewArtist] = useState({
    name: "",
  });
  const [editArtist, setEditArtist] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/artists");
      if (!response.ok) {
        throw new Error("Failed to fetch artists");
      }
      const data = await response.json();
      setArtists(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const filteredArtists = artists.filter((artist) =>
    (artist.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = filteredArtists.slice(
    indexOfFirstArtist,
    indexOfLastArtist
  );

  const totalPages = Math.ceil(filteredArtists.length / artistsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddArtist = async (e) => {
    e.preventDefault();
    if (!newArtist.name) {
      toast.error("Name is required!");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/artists/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtist),
      });
      if (!response.ok) {
        throw new Error("Failed to add artist");
      }
      toast.success("Artist added successfully!");
      fetchArtists();
      setNewArtist({ name: "" });
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditArtist = async (e) => {
    e.preventDefault();
    if (!editArtist.name) {
      toast.error("Name is required!");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/artists/update/${editArtist.artist_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editArtist),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit artist");
      }
      toast.success("Artist updated successfully!");
      fetchArtists();
      setEditArtist(null);
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteArtist = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/artists/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete artist");
      }
      toast.success("Artist deleted successfully!");
      fetchArtists();
    } catch (err) {
      toast.error(err.message);
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
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 mt-10">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Manage Artists
        </h1>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artists..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <ul className="space-y-4">
          {currentArtists.map((artist) => (
            <li
              key={artist.id}
              className="p-4 bg-gray-200 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{artist.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditArtist(artist);
                    setIsEditModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteArtist(artist.artist_id)}
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

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          Add New Artist
        </button>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Add New Artist
            </h2>
            <form onSubmit={handleAddArtist}>
              <label>Name</label>
              <input
                type="text"
                value={newArtist.name}
                onChange={(e) =>
                  setNewArtist({ ...newArtist, name: e.target.value })
                }
                placeholder="Artist Name"
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

      {isEditModalOpen && editArtist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Edit Artist
            </h2>
            <form onSubmit={handleEditArtist}>
              <label>Name</label>
              <input
                type="text"
                value={editArtist.name}
                onChange={(e) =>
                  setEditArtist({ ...editArtist, name: e.target.value })
                }
                placeholder="Artist Name"
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

export default ArtistManagementPage;
