import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AlbumPage = () => {
  const { album_id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const albumResponse = await fetch(
          `http://localhost:3000/api/albums/${album_id}`
        );
        if (!albumResponse.ok) {
          throw new Error("Failed to fetch album information");
        }
        const albumData = (await albumResponse.json())[0];

        const tracksResponse = await fetch(
          `http://localhost:3000/api/tracks/album/${album_id}`
        );
        if (!tracksResponse.ok) {
          throw new Error("Failed to fetch album tracks");
        }
        const tracksData = await tracksResponse.json();

        setAlbum(albumData);
        setTracks(tracksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [album_id]);

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
          <h1 className="text-3xl font-bold text-gray-800">{album.title}</h1>
          <p className="text-lg text-gray-600 mt-2">Album Details</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            <span className="font-light">Tracks in</span> {album.title}{" "}
            <span className="font-light">by</span> {tracks[0].artist_name}
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
                  </div>
                  <button className="px-4 py-2 text-sm bg-purple-500 rounded-md hover:bg-purple-600 transition">
                    ${track.unit_price}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-600">
              No tracks available for this album.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
