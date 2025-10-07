import React from "react";
import { useState } from "react";
import cover1 from "../imgs/cover1.jpeg";
import cover2 from "../imgs/cover2.jpg";
import cover3 from "../imgs/cover3.jpg";
import cover4 from "../imgs/cover4.jpg";
import cover5 from "../imgs/cover5.jpeg";
import cover6 from "../imgs/cover6.jpeg";
import cover7 from "../imgs/cover7.jpg";
import cover8 from "../imgs/cover8.jpg";
import cover9 from "../imgs/cover9.jpg";
import cover10 from "../imgs/cover10.jpg";
import cover11 from "../imgs/cover11.jpg";
import cover12 from "../imgs/cover12.jpg";
import cover13 from "../imgs/cover13.jpg";
import cover14 from "../imgs/cover14.jpg";
import cover15 from "../imgs/cover15.jpg";
import cover16 from "../imgs/cover16.jpg";
import cover17 from "../imgs/cover17.jpg";
import cover18 from "../imgs/cover18.jpg";
import cover19 from "../imgs/cover19.jpg";
import { FaDice } from "react-icons/fa";

const HomePage = () => {
  const albumCovers = [
    cover1,
    cover2,
    cover3,
    cover4,
    cover5,
    cover6,
    cover7,
    cover8,
    cover9,
    cover10,
    cover11,
    cover12,
    cover13,
    cover14,
    cover15,
    cover16,
    cover17,
    cover18,
    cover19,
  ];

  const [currentCover, setCurrentCover] = useState(albumCovers[2]);

  const handleRandomCover = () => {
    const randomIndex = Math.floor(Math.random() * albumCovers.length);
    setCurrentCover(albumCovers[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center p-6">
      <header className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:pr-8">
          <h1 className="text-5xl font-extrabold text-gray-800 leading-snug mb-4">
            Welcome to MusicMarket!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover a world of music, artists, albums, and tracks!
          </p>
          <a
            href="/aboutproject"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition"
          >
            Learn More
          </a>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-80 h-80">
            <img
              src={currentCover}
              alt="Album cover"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <button
            onClick={handleRandomCover}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
          >
            <FaDice className="text-xl" />
          </button>
        </div>
      </header>

      <section
        id="features"
        className="w-full max-w-6xl mt-16 bg-white rounded-2xl shadow-2xl p-10"
      >
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Explore
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <a
            href="/artists"
            className="p-8 bg-gradient-to-tr from-purple-500 to-purple-400 text-white rounded-xl shadow-lg text-center hover:scale-105 transition transform"
          >
            <h3 className="text-2xl font-semibold mb-4">Explore Artists</h3>
            <p className="text-sm">
              Dive into a catalog of artists from around the world. Search,
              filter, and discover new favorites.
            </p>
          </a>
          <a
            href="/albums"
            className="p-8 bg-gradient-to-tr from-orange-500 to-orange-400 text-white rounded-xl shadow-lg text-center hover:scale-105 transition transform"
          >
            <h3 className="text-2xl font-semibold mb-4">Discover Albums</h3>
            <p className="text-sm">
              Explore albums spanning genres and decades. Uncover hidden gems or
              revisit classics.
            </p>
          </a>
          <a
            href="/tracks"
            className="p-8 bg-gradient-to-tr from-pink-500 to-pink-400 text-white rounded-xl shadow-lg text-center hover:scale-105 transition transform"
          >
            <h3 className="text-2xl font-semibold mb-4">Browse Tracks</h3>
            <p className="text-sm">
              Get detailed track information, including genre, artist, and
              duration. Your music exploration starts here.
            </p>
          </a>
          <a
            href="/playlists"
            className="p-8 bg-gradient-to-tr from-teal-500 to-teal-400 text-white rounded-xl shadow-lg text-center hover:scale-105 transition transform"
          >
            <h3 className="text-2xl font-semibold mb-4">Discover Playlists</h3>
            <p className="text-sm">
              Explore curated playlists for every mood and occasion.
            </p>
          </a>
        </div>
      </section>
      <section className="w-full max-w-6xl mt-16 text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Admin Access
          </h2>
          <p className="text-gray-600 mb-6">
            Manage the database and ensure smooth operations. Admins only.
          </p>
          <a
            href="/adminlogin"
            className="bg-gradient-to-r from-red-500 to-red-400 text-white px-6 py-3 rounded-lg shadow-lg hover:from-red-600 hover:to-red-500 transition"
          >
            Admin Login
          </a>
        </div>
      </section>

      <footer className="w-full max-w-6xl mt-16 bg-white rounded-2xl shadow-2xl p-8 text-center">
        <p className="text-gray-600">
          © 2024 Elif Feyza Güler. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
