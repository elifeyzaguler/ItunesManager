import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PlaylistTracksList = () => {
  const { playlistId } = useParams();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 5;

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/playlists/${playlistId}/tracks`
        );
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

    fetchTracks();
  }, [playlistId]);

  const filteredTracks = tracks.filter((track) =>
    track.track_name.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading tracks...</p>
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

  if (tracks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">
          No tracks found in this playlist.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 mt-10">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Tracks in Playlist
        </h1>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for tracks..."
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <ul className="space-y-4">
          {currentTracks.map((track) => (
            <li
              key={track.track_id}
              className="p-5 bg-gradient-to-r from-gray-400 to-gray-200 text-white rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <p className="text-lg font-semibold">{track.track_name}</p>
                <p className="text-base">Artist: {track.artist_name}</p>
                <p className="text-base">Album: {track.album_title}</p>
              </div>
              <button className="mt-2 md:mt-0 px-5 py-2 text-sm bg-slate-600 rounded-md hover:bg-slate-500 transition">
                Play
              </button>
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

export default PlaylistTracksList;
