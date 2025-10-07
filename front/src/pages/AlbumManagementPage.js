import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const AlbumManagementPage = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const albumsPerPage = 5;
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist_id: "",
  });
  const [editAlbum, setEditAlbum] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/albums");
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      const data = await response.json();
      setAlbums(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/artists");
      if (!response.ok) {
        throw new Error("Failed to fetch artists");
      }
      const data = await response.json();
      setArtists(data);
    } catch (err) {
      toast.error("Failed to fetch artists");
    }
  };

  useEffect(() => {
    fetchAlbums();
    fetchArtists();
  }, []);

  const filteredAlbums = albums.filter((album) =>
    (album.title?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = filteredAlbums.slice(
    indexOfFirstAlbum,
    indexOfLastAlbum
  );

  const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbum.title || !newAlbum.artist_id) {
      toast.error("Title and Artist are required!");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/albums/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlbum),
      });
      if (!response.ok) {
        throw new Error("Failed to add album");
      }
      toast.success("Album added successfully!");
      fetchAlbums();
      setNewAlbum({ title: "", artist_id: "" });
      setSearchQuery("");
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditAlbum = async (e) => {
    e.preventDefault();
    if (!editAlbum.title || !editAlbum.artist_id) {
      toast.error("Title and Artist are required!");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/albums/update/${editAlbum.album_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editAlbum),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit album");
      }
      toast.success("Album updated successfully!");
      fetchAlbums();
      setEditAlbum(null);
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAlbum = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/albums/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete album");
      }
      toast.success("Album deleted successfully!");
      fetchAlbums();
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
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="absolute top-6 right-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
      >
        Add New Album
      </button>
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 mt-10">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Manage Albums
        </h1>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search albums..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <ul className="space-y-4">
          {currentAlbums.map((album) => (
            <li
              key={album.id}
              className="p-4 bg-gray-200 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{album.title}</p>
                <p className="text-sm">Artist: {album.artist_name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditAlbum(album);
                    setIsEditModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAlbum(album.album_id)}
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
              Add New Album
            </h2>
            <form onSubmit={handleAddAlbum}>
              <label>Album Title</label>
              <input
                type="text"
                value={newAlbum.title}
                onChange={(e) =>
                  setNewAlbum({ ...newAlbum, title: e.target.value })
                }
                placeholder="Album Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <label>Artist</label>
              <select
                value={newAlbum.artist_id}
                onChange={(e) =>
                  setNewAlbum({ ...newAlbum, artist_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Artist</option>
                {artists.map((artist) => (
                  <option key={artist.artist_id} value={artist.artist_id}>
                    {artist.name}
                  </option>
                ))}
              </select>
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

      {isEditModalOpen && editAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Album</h2>
            <form onSubmit={handleEditAlbum}>
              <label>Album Title</label>
              <input
                type="text"
                value={editAlbum.title}
                onChange={(e) =>
                  setEditAlbum({ ...editAlbum, title: e.target.value })
                }
                placeholder="Album Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <label>Artist</label>
              <select
                value={editAlbum.artist_id}
                onChange={(e) =>
                  setEditAlbum({ ...editAlbum, artist_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Artist</option>
                {artists.map((artist) => (
                  <option key={artist.artist_id} value={artist.artist_id}>
                    {artist.name}
                  </option>
                ))}
              </select>
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

export default AlbumManagementPage;
