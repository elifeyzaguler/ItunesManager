import React from "react";

const AboutProject = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            About This Project
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            MusicMarket is a user-friendly tool to explore music, tracks, albums
            and artists. Search, edit, add new tracks, albums, artists you love!
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Key Features
          </h2>
          <ul className="space-y-6">
            <li className="flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white p-6 rounded-lg shadow-md">
              <div className="flex-shrink-0 text-4xl">🎵</div>
              <div>
                <h3 className="text-2xl font-semibold">Explore Artists</h3>
                <p className="text-white">
                  Browse through a rich catalog of artists, filter by genres,
                  and discover new music.
                </p>
              </div>
            </li>
            <li className="flex items-center space-x-4 bg-gradient-to-r from-green-500 to-green-400 text-white p-6 rounded-lg shadow-md">
              <div className="flex-shrink-0 text-4xl">💿</div>
              <div>
                <h3 className="text-2xl font-semibold">Discover Albums</h3>
                <p className="text-white">
                  Dive into albums spanning decades and genres. Find your
                  favorites or uncover hidden gems.
                </p>
              </div>
            </li>
            <li className="flex items-center space-x-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-6 rounded-lg shadow-md">
              <div className="flex-shrink-0 text-4xl">📀</div>
              <div>
                <h3 className="text-2xl font-semibold">Browse Tracks</h3>
                <p className="text-white">
                  Get detailed information about tracks, including duration,
                  genre, and the artists behind the music.
                </p>
              </div>
            </li>
            <li className="flex items-center space-x-4 bg-gradient-to-r from-red-500 to-red-400 text-white p-6 rounded-lg shadow-md">
              <div className="flex-shrink-0 text-4xl">📊</div>
              <div>
                <h3 className="text-2xl font-semibold">
                  Manage Database using Admin Dashboard
                </h3>
                <p className="text-white">
                  Insert, update, delete, manage the data using user-friendly
                  admin dashboard!
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Explore?
          </h2>
          <a
            href="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
