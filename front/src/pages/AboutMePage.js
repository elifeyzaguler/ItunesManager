import React from "react";
import profileImage from "../me.jpg";

const AboutMe = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-10">
        <div className="text-center">
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full shadow-lg mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Elif Feyza Güler
          </h1>
          <p className="text-lg text-gray-600">
            Software Developer | Computer Engineering Student
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Hi! I'm a computer engineering student at Istanbul Technical
            University and a passionate software developer. I love solving
            problems, creating efficient solutions, and exploring new
            technologies.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Skills</h2>
          <ul className="flex flex-wrap gap-4 justify-center">
            <li className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-4 py-2 rounded-lg shadow-md">
              React
            </li>
            <li className="bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-lg shadow-md">
              Node.js
            </li>
            <li className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white px-4 py-2 rounded-lg shadow-md">
              JavaScript
            </li>
            <li className="bg-gradient-to-r from-purple-500 to-purple-400 text-white px-4 py-2 rounded-lg shadow-md">
              Python
            </li>
            <li className="bg-gradient-to-r from-red-500 to-red-400 text-white px-4 py-2 rounded-lg shadow-md">
              SQL
            </li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Contact Me
          </h2>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:gulere20@itu.edu.tr"
              className="bg-gradient-to-r from-green-500 to-green-400 text-white px-6 py-3 rounded-lg shadow-lg hover:from-green-600 hover:to-green-500 transition"
            >
              Email Me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
