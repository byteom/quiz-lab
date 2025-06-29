// src/pages/Dashboard.jsx
import { Link } from 'react-router-dom';
import { FaCode, FaCogs, FaCalculator, FaBookOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

const subjects = [
  {
    name: "C++ Programming",
    icon: <FaCode className="text-pink-500 text-4xl mb-3" />,
    description: "Master object-oriented programming and modern C++ features",
    chapters: [
      { id: "cpp_basics", title: "C++ Basics", difficulty: "Beginner" },
      { id: "cpp_advanced", title: "Advanced C++", difficulty: "Intermediate" },
      { id: "cpp_stl", title: "STL & Templates", difficulty: "Advanced" }
    ]
  },
  {
    name: "Operating Systems",
    icon: <FaCogs className="text-purple-500 text-4xl mb-3" />,
    description: "Learn about processes, memory management, and file systems",
    chapters: [
      { id: "os_basics", title: "OS Fundamentals", difficulty: "Beginner" },
      { id: "os_advanced", title: "Kernel Internals", difficulty: "Advanced" },
      { id: "os_concurrency", title: "Concurrency", difficulty: "Intermediate" }
    ]
  },
  {
    name: "Mathematics",
    icon: <FaCalculator className="text-blue-500 text-4xl mb-3" />,
    description: "Sharpen your mathematical skills for computer science",
    chapters: [
      { id: "math_algebra_basics", title: "Algebra Basics", difficulty: "Beginner" },
      { id: "math_discrete", title: "Discrete Math", difficulty: "Intermediate" },
      { id: "math_calculus", title: "Calculus", difficulty: "Advanced" }
    ]
  },
  {
    name: "Algorithms",
    icon: <FaBookOpen className="text-emerald-500 text-4xl mb-3" />,
    description: "Explore data structures and algorithm design",
    chapters: [
      { id: "algo_sorting", title: "Sorting Algorithms", difficulty: "Beginner" },
      { id: "algo_graph", title: "Graph Algorithms", difficulty: "Intermediate" },
      { id: "algo_dp", title: "Dynamic Programming", difficulty: "Advanced" }
    ]
  }
];

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4">
            Knowledge Quest
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a subject and challenge yourself with our interactive quizzes. Track your progress and master each topic.
          </p>
        </motion.div>

        {/* Subject Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.03 }}
              className="relative rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-6 px-6 border-b border-gray-200">
                <div className="flex justify-center">{subject.icon}</div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                  {subject.name}
                </h2>
                <p className="text-sm text-gray-500 text-center">
                  {subject.description}
                </p>
              </div>

              {/* Chapters */}
              <div className="p-6">
                <ul className="space-y-3">
                  {subject.chapters.map((chapter) => (
                    <li key={chapter.id}>
                      <Link
                        to={`/quiz/${chapter.id}`}
                        className="block py-3 px-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800 group-hover:text-blue-600">
                            {chapter.title}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            chapter.difficulty === "Beginner" 
                              ? "bg-green-100 text-green-800" 
                              : chapter.difficulty === "Intermediate" 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-red-100 text-red-800"
                          }`}>
                            {chapter.difficulty}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats/Progress Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Learning Progress</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-blue-50">
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">Quizzes Taken</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50">
              <p className="text-3xl font-bold text-green-600">85%</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50">
              <p className="text-3xl font-bold text-purple-600">3</p>
              <p className="text-sm text-gray-600">Mastered Topics</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;