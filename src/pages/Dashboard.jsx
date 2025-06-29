// src/pages/Dashboard.jsx

import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const subjects = [
  {
    name: "C++",
    rank: 2,
    userScore: 87,
    topScore: 95,
    chapters: [
      { id: "cpp_basics", title: "C++ Basics", level: "basic" },
      { id: "cpp_intermediate", title: "C++ Intermediate", level: "intermediate" },
      { id: "cpp_advanced", title: "C++ Advanced", level: "advanced" }
    ]
  },
  {
    name: "Operating Systems",
    rank: 5,
    userScore: 70,
    topScore: 90,
    chapters: [
      { id: "os_basics", title: "OS Basics", level: "basic" },
      { id: "os_intermediate", title: "OS Intermediate", level: "intermediate" },
      { id: "os_advanced", title: "OS Advanced", level: "advanced" }
    ]
  },
  {
    name: "Mathematics",
    rank: 3,
    userScore: 80,
    topScore: 88,
    chapters: [
      { id: "math_basics", title: "Mathematics Basics", level: "basic" },
      { id: "math_intermediate", title: "Mathematics Intermediate", level: "intermediate" },
      { id: "math_advanced", title: "Mathematics Advanced", level: "advanced" }
    ]
  },
  {
    name: "Data Structures",
    rank: 1,
    userScore: 92,
    topScore: 92,
    chapters: [
      { id: "ds_basics", title: "DS Basics", level: "basic" },
      { id: "ds_intermediate", title: "DS Intermediate", level: "intermediate" },
      { id: "ds_advanced", title: "DS Advanced", level: "advanced" }
    ]
  },
  {
    name: "Computer Networks",
    rank: 4,
    userScore: 75,
    topScore: 85,
    chapters: [
      { id: "cn_basics", title: "CN Basics", level: "basic" },
      { id: "cn_intermediate", title: "CN Intermediate", level: "intermediate" },
      { id: "cn_advanced", title: "CN Advanced", level: "advanced" }
    ]
  },
  {
    name: "DBMS",
    rank: 6,
    userScore: 68,
    topScore: 84,
    chapters: [
      { id: "dbms_basics", title: "DBMS Basics", level: "basic" },
      { id: "dbms_intermediate", title: "DBMS Intermediate", level: "intermediate" },
      { id: "dbms_advanced", title: "DBMS Advanced", level: "advanced" }
    ]
  }
];

const chartData = [
  { name: 'Mon', completed: 2, pending: 1 },
  { name: 'Tue', completed: 1, pending: 2 },
  { name: 'Wed', completed: 0, pending: 3 },
  { name: 'Thu', completed: 3, pending: 0 },
  { name: 'Fri', completed: 2, pending: 1 },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Hi, Welcome back!</h1>
      </div>

      {/* subjects */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{subject.name}</h3>
              <ul className="space-y-2">
                {subject.chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <Link
                      to={`/quiz/${chapter.id}`}
                      className={`hover:underline text-xl font-semibold ${
                        chapter.level === 'basic' ? 'text-blue-300' :
                        chapter.level === 'intermediate' ? 'text-blue-500' :
                        'text-blue-700'
                      }`}
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
{/* records */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 mt-5">Your Daily Record</h2>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-500">Total Quizzes</p>
          <h2 className="text-2xl font-bold text-blue-600">6</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold text-green-500">3</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-500">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-500">3</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-500">Revisit Needed</p>
          <h2 className="text-2xl font-bold text-red-500">1</h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Progress Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="#fbbf24" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Leaderboard (vs Others)</h3>
        <ul className="space-y-3">
          {subjects.sort((a, b) => a.rank - b.rank).map((subject, index) => (
            <li
              key={subject.name}
              className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 p-4 rounded-lg shadow-sm border"
            >
              <div className="font-medium text-lg">{index + 1}. {subject.name}</div>
              <div className="text-sm text-gray-600">Your Score: <span className="font-bold text-blue-700">{subject.userScore}</span> / Top Score: <span className="font-bold text-green-600">{subject.topScore}</span></div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default Dashboard;
