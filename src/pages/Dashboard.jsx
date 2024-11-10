// src/pages/Dashboard.jsx

import { Link } from 'react-router-dom';

const subjects = [
  {
    name: "C++",
    chapters: [
      { id: "cpp_basics", title: "C++ Basics" },
      { id: "cpp_advanced", title: "C++ Advanced" }
    ]
  },
  {
    name: "Operating Systems",
    chapters: [
      { id: "os_basics", title: "OS Basics" },
      { id: "os_advanced", title: "OS Advanced" }
    ]
  },
  {
    name: "Mathematics",
    chapters: [
      { id: "math_algebra_basics", title: "Algebra Basics" } // New Chapter
    ]
  }
];

function Dashboard() {
  return (
    <div className="container mx-auto p-10 text-center">
      {/* Page Title with Gradient Text */}
      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-12">
        Select a Subject
      </h2>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl group"
          >
            {/* Neon Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 opacity-25 blur-md rounded-xl"></div>

            {/* Subject Name */}
            <h3 className="relative text-2xl font-semibold mb-6 group-hover:text-pink-400 transition-colors duration-300 z-10">
              {subject.name}
            </h3>

            {/* Chapters List */}
            <ul className="relative space-y-3 z-10">
              {subject.chapters.map((chapter) => (
                <li key={chapter.id}>
                  <Link
                    to={`/quiz/${chapter.id}`}
                    className="text-lg font-medium text-blue-400 hover:text-pink-400 transition duration-300 hover:underline"
                  >
                    {chapter.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
