// src/pages/Chapters.jsx

import { useParams, Link } from 'react-router-dom';

const chaptersData = {
  cpp: [
    { id: "cpp_basics", title: "C++ Basics" },
    { id: "cpp_advanced", title: "C++ Advanced" }
  ],
  os: [
    { id: "os_basics", title: "OS Basics" },
    { id: "os_advanced", title: "OS Advanced" }
  ]
};

function Chapters() {
  const { subjectId } = useParams();
  const chapters = chaptersData[subjectId];

  if (!chapters) {
    return <p className="text-center text-2xl text-red-500 font-semibold">Invalid subject ID.</p>;
  }

  return (
    <div className="container mx-auto p-8 text-center">
      {/* Gradient Title with Neon Glow */}
      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-10 drop-shadow-lg animate-pulse">
        Chapters for {subjectId.toUpperCase()}
      </h2>

      {/* Chapter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {chapters.map((chapter) => (
          <Link
            to={`/quiz/${chapter.id}`}
            key={chapter.id}
            className="relative group bg-gradient-to-r from-blue-900/70 to-purple-900/70 rounded-xl p-6 shadow-lg transition-transform transform hover:-translate-y-4 hover:scale-105"
          >
            {/* Frosted Glass Effect */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl opacity-70 group-hover:opacity-80 transition duration-300"></div>
            
            {/* Chapter Title */}
            <h3 className="relative text-3xl font-bold text-white mb-2 z-10 drop-shadow-md group-hover:text-pink-400 transition-colors duration-300">
              {chapter.title}
            </h3>

            {/* Chapter Description */}
            <p className="relative text-lg text-gray-300 z-10 drop-shadow-md group-hover:text-gray-100 transition-colors duration-300">
              Dive into {chapter.title} for an in-depth exploration.
            </p>

            {/* Neon Border Animation */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-pink-400 transition duration-500"></div>

            {/* Glowing Shadow Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 blur-xl group-hover:opacity-40 transition duration-500"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Chapters;
