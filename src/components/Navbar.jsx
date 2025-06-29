import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, LogOut } from 'lucide-react'; // You can use any icon library
import { useEffect, useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 p-4 shadow-lg rounded-b-lg font-sans">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo or Home Link */}
        <Link
          to="/"
          className="text-2xl font-bold text-white tracking-wider transition-transform transform hover:scale-105 hover:text-cyan-300"
        >
          QuizMaster
        </Link>

        {/* Middle Links */}
        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-lg font-medium text-white hover:text-indigo-300 transition-transform transform hover:scale-105"
          >
            Dashboard
          </Link>

          <a
            href="https://elearn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-white hover:text-indigo-300 transition-transform transform hover:scale-105"
          >
            E-Learn
          </a>
        </div>

        {/* Right Side Auth Buttons */}
        <div className="flex space-x-4 items-center">
          {isLoggedIn ? (
            <>
              <p className="text-white font-semibold hidden sm:block">Hi, {currentUser.name}</p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-white hover:text-red-300 transition-transform transform hover:scale-105"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 text-white hover:text-green-300 transition-transform transform hover:scale-105"
              >
                <LogIn size={20} />
                <span className="hidden sm:inline">Login</span>
              </Link>

              <Link
                to="/signup"
                className="flex items-center gap-1 text-white hover:text-yellow-300 transition-transform transform hover:scale-105"
              >
                <UserPlus size={20} />
                <span className="hidden sm:inline">Signup</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
