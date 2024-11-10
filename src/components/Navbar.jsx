// src/components/Navbar.jsx

import { Link } from 'react-router-dom';

function Navbar() {
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
        
        <div className="flex space-x-6">
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
