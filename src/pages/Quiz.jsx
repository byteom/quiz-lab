import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaCheck, FaRedo, FaFlag } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

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
  const [isLoading, setIsLoading] = useState(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState(
    JSON.parse(localStorage.getItem(`flagged-${chapterId}`)) || new Set()
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await loadQuizData(chapterId);
      setQuestions(data);
      setIsLoading(false);
    };
    fetchData();
  }, [chapterId]);

  const handleAnswer = (option) => {
    setUserAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [currentIndex]: option,
      };
      localStorage.setItem(`quiz-${chapterId}`, JSON.stringify(newAnswers));
      return newAnswers;
    });
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
    navigate(`/result/${chapterId}`);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your answers?")) {
      localStorage.removeItem(`quiz-${chapterId}`);
      setUserAnswers({});
      setCurrentIndex(0);
    }
  };

  const toggleFlagQuestion = (index) => {
    setFlaggedQuestions(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(index)) {
        newFlags.delete(index);
      } else {
        newFlags.add(index);
      }
      localStorage.setItem(`flagged-${chapterId}`, JSON.stringify(Array.from(newFlags)));
      return newFlags;
    });
  };

  const formatChapterTitle = (id) => {
    return id.replace(/_/g, ' ')
             .replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-blue-500 text-4xl"
        >
          <ImSpinner8 />
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Quiz Not Available</h2>
          <p className="text-gray-600 mb-6">We couldn&#39;t load the quiz questions for this chapter.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar for question navigation */}
          <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <h2 className="text-xl font-bold mb-2">Question Navigation</h2>
              <p className="text-sm opacity-90">{formatChapterTitle(chapterId)}</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-5 gap-3 overflow-y-auto max-h-[320px] custom-scrollbar pb-2">
                {questions.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      index === currentIndex
                        ? 'bg-blue-500 text-white shadow-md'            // Current question
                        : userAnswers[index]
                        ? 'bg-green-100 text-green-800 border border-green-300' // Answered
                        : 'bg-gray-100 text-gray-700 border border-gray-300'     // Unanswered
                    } ${flaggedQuestions.has(index) ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Current</span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300 mr-2"></div>
                  <span className="text-sm">Answered</span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300 mr-2"></div>
                  <span className="text-sm">Unanswered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400 mr-2"></div>
                  <span className="text-sm">Flagged</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main quiz content */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                {formatChapterTitle(chapterId)}
              </h2>
              <div className="text-lg font-semibold text-gray-600">
                Question {currentIndex + 1} of {questions.length}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-xl font-semibold text-gray-800">
                      {questions[currentIndex].question}
                    </p>
                    <button
                      onClick={() => toggleFlagQuestion(currentIndex)}
                      className={`p-2 rounded-full ${flaggedQuestions.has(currentIndex) ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500'}`}
                    >
                      <FaFlag />
                    </button>
                  </div>

                  <div className="space-y-3 mt-6">
                    {questions[currentIndex].options.map((option, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswer(option)}
                        className={`w-full text-left p-4 rounded-lg transition-all ${
                          userAnswers[currentIndex] === option
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-medium">{String.fromCharCode(65 + idx)}.</span>
                          <span className="ml-2">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-full shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronLeft />
                  Previous
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-full shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                  <FaChevronRight />
                </motion.button>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-700 rounded-full shadow-sm hover:bg-red-200 transition"
                >
                  <FaRedo />
                  Reset
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition"
                >
                  <FaCheck />
                  Submit Quiz
                </motion.button>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-8">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-blue-500"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
                <span>{currentIndex + 1}/{questions.length} questions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;