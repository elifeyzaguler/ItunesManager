import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiBriefcase,
  FiMenu,
  FiArrowLeft,
  FiSettings,
} from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative">
      <div className="fixed z-20 flex space-x-4 m-4">
        <button
          onClick={toggleSidebar}
          className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-xl hover:from-purple-600 hover:to-pink-600 transition"
        >
          <FiMenu className="text-2xl" />
        </button>
        <button
          onClick={goBack}
          className="p-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-full shadow-xl hover:from-gray-600 hover:to-gray-800 transition"
        >
          <FiArrowLeft className="text-2xl" />
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 z-10`}
      >
        <div className="p-8 mr-5 text-center"></div>
        <ul className="mt-8 space-y-6 px-6">
          <h2 className="text-3xl font-bold">Menu</h2>
          <li onClick={toggleSidebar}>
            <Link
              to="/"
              className="flex items-center space-x-3 hover:bg-purple-700 p-4 rounded-lg transition"
            >
              <FiHome className="text-xl" />
              <span className="text-lg font-semibold">Home</span>
            </Link>
          </li>
          <li onClick={toggleSidebar}>
            <Link
              to="/aboutme"
              className="flex items-center space-x-3 hover:bg-purple-700 p-4 rounded-lg transition"
            >
              <FiUser className="text-xl" />
              <span className="text-lg font-semibold">About Me</span>
            </Link>
          </li>
          <li onClick={toggleSidebar}>
            <Link
              to="/aboutproject"
              className="flex items-center space-x-3 hover:bg-purple-700 p-4 rounded-lg transition"
            >
              <FiBriefcase className="text-xl" />
              <span className="text-lg font-semibold">About Project</span>
            </Link>
          </li>
          <li onClick={toggleSidebar}>
            <Link
              to="/adminlogin"
              className="flex items-center space-x-3 hover:bg-purple-700 p-4 rounded-lg transition"
            >
              <FiSettings className="text-xl" />
              <span className="text-lg font-semibold">Admin Login</span>
            </Link>
          </li>
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
