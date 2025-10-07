import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ArtistPage = () => {
  const { artist_id } = useParams();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const artistResponse = await fetch(
          `http://localhost:3000/api/artists/${artist_id}`
        );
        if (!artistResponse.ok) {
          throw new Error("Failed to fetch artist information");
        }
        const artistData = (await artistResponse.json())[0];

        const tracksResponse = await fetch(
          `http://localhost:3000/api/tracks/artist/${artist_id}`
        );
        if (!tracksResponse.ok) {
          throw new Error("Failed to fetch artist tracks");
        }
        const tracksData = await tracksResponse.json();

        setArtist(artistData);
        setTracks(tracksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artist_id]);

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{artist.name}</h1>
          <p className="text-lg text-gray-600 mt-2">Artist Details</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tracks by {artist.name}
          </h2>
          {tracks.length > 0 ? (
            <ul className="space-y-4">
              {tracks.map((track) => (
                <li
                  key={track.id}
                  className="p-4 bg-gradient-to-r from-gray-400 to-gray-200 text-white rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-semibold">{track.track_name}</p>
                    <p className="text-sm">{track.album_name}</p>
                  </div>
                  <button className="px-4 py-2 text-sm bg-purple-500 rounded-md hover:bg-purple-600 transition">
                    ${track.unit_price}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-600">
              No tracks available for this artist.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
