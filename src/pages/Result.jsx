// src/pages/Result.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Result() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const module = await import(`../data/${chapterId}.json`);
        setQuestions(module.default);

        const userAnswers = JSON.parse(localStorage.getItem(`quiz-${chapterId}`)) || {};
        let correctAnswers = 0;
        let totalAttempted = 0;

        module.default.forEach((question, index) => {
          const userAnswer = userAnswers[index];
          if (userAnswer !== undefined) {
            totalAttempted += 1;
            if (question.answer === userAnswer) {
              correctAnswers += 1;
            }
          }
        });

        setScore(correctAnswers);
        setAttempted(totalAttempted);

      } catch (error) {
        console.error("Failed to load result data:", error);
      }
    };

    loadQuestions();
  }, [chapterId]);

  const handleRetakeQuiz = () => {
    localStorage.removeItem(`quiz-${chapterId}`);
    navigate(`/quiz/${chapterId}`);
  };

  const handleGoToReLearn = () => {
    navigate(`/relearn/${chapterId}`);
  };

  if (questions.length === 0) {
    return <p className="text-center text-lg text-gray-600">Loading results...</p>;
  }

  return (
    <div className="container mx-auto p-10 bg-gray-100 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-8 text-center">
        Quiz Results
      </h2>

      <div className="text-center mb-8">
        <p className="text-lg font-medium text-gray-800">Total Questions: {questions.length}</p>
        <p className="text-lg font-medium text-gray-800">Attempted Questions: {attempted}</p>
        <p className="text-lg font-medium text-gray-800">Correct Answers: {score}</p>
      </div>

      {/* Detailed question review */}
      <div className="mt-8 space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="p-6 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-lg font-semibold text-gray-800">Q{index + 1}: {question.question}</p>
            <p className="mt-2 text-blue-600">Correct Answer: {question.answer}</p>
            <p className="text-gray-600 mt-1">Solution: {question.solution}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mt-10 flex justify-center gap-6">
        <button
          onClick={handleRetakeQuiz}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition-transform transform hover:scale-105"
        >
          Retake Quiz
        </button>
        
        <button
          onClick={handleGoToReLearn}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl transition-transform transform hover:scale-105"
        >
          Go to ReLearn
        </button>

        {/* Direct external link to ReLearn.com */}
        <a
          href="https://relearn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-full shadow-lg hover:bg-purple-600 hover:shadow-xl transition-transform transform hover:scale-105"
        >
          Go to ReLearn.com
        </a>
      </div>
    </div>
  );
}

export default Result;
