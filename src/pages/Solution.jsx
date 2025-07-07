// src/pages/Solution.jsx

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Solution() {
const { chapterId } = useParams(); // ✅ Matches your route

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const module = await import(`../data/${chapterId}.json`);
        setQuestions(module.default);
      } catch (error) {
        console.error("Failed to load solution data:", error);
      }
    };
    
    loadQuestions();
  }, [subject]);

  if (questions.length === 0) {
    return <p className="text-center text-lg text-gray-500">Loading solutions...</p>;
  }

  return (
    <div className="container mx-auto p-10 bg-gray-100 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-8 text-center">
        Solutions for {subject.toUpperCase()}
      </h2>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="p-6 bg-white/20 backdrop-blur-md rounded-xl shadow-md border-l-4 border-blue-500 transition transform hover:scale-105 hover:shadow-xl">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Q{index + 1}: {question.question}
            </p>
            <p className="text-blue-600 font-medium mb-1">Answer: {question.answer}</p>
            <p className="text-gray-700 italic">Solution: {question.solution}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Solution;
