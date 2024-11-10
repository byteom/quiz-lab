// src/pages/Quiz.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Dynamically import JSON data files based on chapter ID
const loadQuizData = async (chapterId) => {
  try {
    const module = await import(`../data/${chapterId}.json`);
    return module.default;
  } catch (error) {
    console.error("Failed to load quiz data:", error);
    return [];
  }
};

function Quiz() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    JSON.parse(localStorage.getItem(`quiz-${chapterId}`)) || {}
  );

  useEffect(() => {
    loadQuizData(chapterId).then(setQuestions);
  }, [chapterId]);

  const handleAnswer = (option) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
    }
  };

  const handleSubmit = () => {
    localStorage.setItem(`quiz-${chapterId}`, JSON.stringify(userAnswers));
    navigate(`/result/${chapterId}`);
  };

  const handleReset = () => {
    localStorage.removeItem(`quiz-${chapterId}`);
    setUserAnswers({});
    setCurrentIndex(0);
  };

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="container mx-auto p-8 flex">
      {/* Sidebar for question navigation */}
      <div className="w-1/4 p-4 bg-gradient-to-b from-gray-600 to-gray-500 text-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-6">Question Navigation</h2>
        
        {/* Scrollable navigation with circular buttons */}
        <div className="grid grid-cols-5 gap-4 overflow-y-auto max-h-[320px] custom-scrollbar">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-10 h-10 rounded-full text-center font-semibold transition transform hover:scale-105 ${
                index === currentIndex
                  ? 'bg-blue-500 text-white'            // Current question color
                  : userAnswers[index]
                  ? 'bg-red-500 text-white'             // Attempted question color
                  : 'border border-gray-400 text-gray-700' // Unattempted question color
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main quiz content */}
      <div className="w-3/4 pl-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-6">
          Quiz - {chapterId.replace('_', ' ')}
        </h2>

        {/* Display current question */}
        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-300 mb-8">
          <p className="text-2xl font-semibold text-gray-800">
            Q{currentIndex + 1}: {questions[currentIndex].question}
          </p>
          <div className="mt-4">
            {questions[currentIndex].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className={`block w-full text-left p-3 mb-3 rounded-lg transition-transform transform hover:scale-105 ${
                  userAnswers[currentIndex] === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation and Reset buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-400 text-white rounded-full shadow-md hover:bg-gray-500 disabled:bg-gray-300 transition duration-300"
          >
            Previous
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            Submit Quiz
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Next
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
          >
            Reset Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
