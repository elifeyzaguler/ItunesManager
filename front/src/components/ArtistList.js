import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ArtistList = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const artistsPerPage = 5;

  useEffect(() => {
    const fetchArtists = async () => {
      try {
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

    fetchArtists();
  }, []);

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading artists...</p>
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
          Artist List
        </h1>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for artists..."
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <ul className="space-y-4">
          {currentArtists.map((artist) => (
            <li
              key={artist.artist_id}
              className="p-5 bg-gradient-to-r from-gray-400 to-gray-200 text-white rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <p className="text-lg font-semibold">{artist.name}</p>
              </div>
              <Link
                to={`/artist/${artist.artist_id}`}
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

export default ArtistList;
