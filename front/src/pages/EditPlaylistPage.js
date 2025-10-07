import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditPlaylistPage = () => {
  const { playlistId } = useParams();
  const [tracks, setTracks] = useState([]);
  const [allTracks, setAllTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [trackSearchQuery, setTrackSearchQuery] = useState("");
  const [filteredTrackSearchResults, setFilteredTrackSearchResults] = useState(
    []
  );
  const [selectedTrackIds, setSelectedTrackIds] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const tracksPerPage = 5; // Number of tracks per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const allTracksResponse = await fetch(
          `http://localhost:3000/api/tracks`
        );
        if (!allTracksResponse.ok) {
          throw new Error("Failed to fetch all tracks");
        }
        const allTracksData = await allTracksResponse.json();
        setAllTracks(allTracksData);
        setFilteredTrackSearchResults(allTracksData);
        const playlistResponse = await fetch(
          `http://localhost:3000/api/playlists/${playlistId}/tracks`
        );
        if (!playlistResponse.ok) {
          throw new Error("Failed to fetch playlist tracks");
        }
        const playlistData = await playlistResponse.json();
        setTracks(playlistData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [playlistId]);

  const handleTrackSearch = (query) => {
    setTrackSearchQuery(query);
    if (query.trim() === "") {
      setFilteredTrackSearchResults(allTracks);
    } else {
      setFilteredTrackSearchResults(
        allTracks.filter((track) =>
          track.track_name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const handleRemoveTrack = async (trackId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/playlists/${playlistId}/tracks/${trackId}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove track");
      }

      setTracks((prev) => prev.filter((track) => track.track_id !== trackId));
      toast.success("Track removed successfully!");
    } catch (err) {
      console.error(err.message);
      toast.error("Error removing track.");
    }
  };

  const addTrackToSelection = (track) => {
    if (!selectedTrackIds.includes(track.track_id)) {
      setSelectedTrackIds((prev) => [...prev, track.track_id]);
      setSelectedTracks((prev) => [...prev, track]);
    }
  };

  const removeTrackFromSelection = (trackId) => {
    setSelectedTrackIds((prev) => prev.filter((id) => id !== trackId));
    setSelectedTracks((prev) =>
      prev.filter((track) => track.track_id !== trackId)
    );
  };

  const handleAddTracksToPlaylist = async () => {
    if (selectedTrackIds.length === 0) {
      toast.error("No tracks selected.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/playlists/${playlistId}/tracks/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trackIds: selectedTrackIds }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add tracks");
      }

      const playlistResponse = await fetch(
        `http://localhost:3000/api/playlists/${playlistId}/tracks`
      );
      if (!playlistResponse.ok) {
        throw new Error("Failed to fetch playlist tracks");
      }
      const playlistData = await playlistResponse.json();
      setTracks(playlistData);
      setIsAddSongModalOpen(false);
      setSelectedTrackIds([]);
      setSelectedTracks([]);
      toast.success("Tracks added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error adding tracks.");
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/playlists/delete/${playlistId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete playlist");
      }

      toast.success("Playlist deleted successfully!");
      navigate("/playlists-admin");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting playlist.");
    }
  };

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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full flex justify-center items-center space-x-8 px-8 mt-6">
        <button
          onClick={() => setIsAddSongModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white font-bold rounded shadow-lg hover:bg-green-600 transition"
        >
          Add Song
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-4 py-2 bg-red-500 text-white font-bold rounded shadow-lg hover:bg-red-600 transition"
        >
          Delete Playlist
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 mt-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Tracks in Playlist
        </h1>

        {tracks.length > 0 && (
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for tracks..."
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        )}

        {tracks.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No tracks found in this playlist.</p>
          </div>
        ) : (
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
                <button
                  onClick={() => handleRemoveTrack(track.track_id)}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {tracks.length > 0 && (
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
        )}
      </div>

      {isAddSongModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Tracks</h2>

            <div className="mb-4">
              <input
                type="text"
                value={trackSearchQuery}
                onChange={(e) => handleTrackSearch(e.target.value)}
                placeholder="Search for tracks..."
                className="w-full p-2 border rounded-lg mb-2"
              />
            </div>

            <ul className="mb-4 max-h-40 overflow-y-auto">
              {filteredTrackSearchResults.map((track) => (
                <li
                  key={track.track_id}
                  className="p-2 border-b flex justify-between items-center"
                >
                  <span>
                    {track.track_name} - {track.artist_name}
                  </span>
                  <button
                    onClick={() => addTrackToSelection(track)}
                    className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>

            <div className="mb-4">
              <h3 className="font-bold text-lg">Selected Tracks:</h3>
              <ul>
                {selectedTracks.map((track) => (
                  <li
                    key={track.track_id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <span>{track.track_name}</span>
                    <button
                      onClick={() => removeTrackFromSelection(track.track_id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition"
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAddSongModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTracksToPlaylist}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Add Tracks
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Delete Playlist</h2>
            <p className="mb-4">
              Are you sure you want to delete this playlist?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPlaylistPage;
