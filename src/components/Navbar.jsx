// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  // Initialize dark mode from localStorage
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Apply or remove dark mode class on body when state changes
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 p-4 shadow-lg rounded-b-lg font-sans">
      <div className="container mx-auto flex justify-between items-center space-x-8">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-semibold text-white tracking-wider transition-transform transform hover:scale-105 hover:text-cyan-300"
        >
          QuizMaster
        </Link>

        {/* Links and Dark Mode Toggle */}
        <div className="flex space-x-6 items-center">

          <Link
            to="/"
            className="text-lg font-medium text-white transition duration-300 transform hover:scale-105 hover:text-indigo-300"
          >
            Dashboard
          </Link>

          <a
            href="https://elearn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-white transition duration-300 transform hover:scale-105 hover:text-indigo-300"
          >
            E-Learn
          </a>

          {/* Accessible Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            title="Toggle Dark Mode"
            className="ml-4 px-3 py-1 bg-gray-800 text-white text-xl rounded-md hover:bg-gray-700 transition"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
