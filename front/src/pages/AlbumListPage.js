import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const albumsPerPage = 5;

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
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

    fetchAlbums();
  }, []);

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading albums...</p>
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
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 mt-10">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Album List
        </h1>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for albums..."
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <ul className="space-y-4">
          {currentAlbums.map((album) => (
            <li
              key={album.album_id}
              className="p-5 bg-gradient-to-r from-gray-400 to-gray-200 text-white rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <p className="text-lg font-semibold">{album.title}</p>
                <p className="text-base font-light">
                  By <span className="font-semibold">{album.artist_name}</span>
                </p>
              </div>
              <Link
                to={`/albums/${album.album_id}`}
                className="mt-2 md:mt-0 px-5 py-2 text-sm bg-slate-600 rounded-md hover:bg-slate-500 transition text-center text-white"
              >
                View
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-5 py-2 text-sm rounded-md shadow-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-purple-500 text-white hover:bg-purple-600 transition"
            }`}
          >
            Previous
          </button>
          <p className="text-gray-700 text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 text-sm rounded-md shadow-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-purple-500 text-white hover:bg-purple-600 transition"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumList;
