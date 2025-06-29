// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [dark, setDark] = useState(false);

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 p-4 shadow-lg rounded-b-lg font-sans">
      <div className="container mx-auto flex justify-between items-center space-x-8">
        
        {/* Logo or Home Link */}
        <Link
          to="/"
          className="text-2xl font-semibold text-white tracking-wider transition-transform transform hover:scale-105 hover:text-cyan-300"
        >
          QuizMaster
        </Link>

        {/* Navigation Links + Dark Mode Toggle */}
        <div className="flex space-x-6 items-center">
          {/* Dashboard Link */}
          <Link
            to="/"
            className="text-lg font-medium text-white transition duration-300 transform hover:scale-105 hover:text-indigo-300"
          >
            Dashboard
          </Link>

          {/* E-Learn Link */}
          <a
            href="https://elearn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-white transition duration-300 transform hover:scale-105 hover:text-indigo-300"
          >
            E-Learn
          </a>

          {/* Dark Mode Toggle Button with Emoji */}
          <button
            onClick={toggleDarkMode}
            className="ml-4 px-3 py-1 bg-gray-800 text-white text-xl rounded-md hover:bg-gray-700 transition"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
