import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRedo, FaBookOpen, FaExternalLinkAlt, FaTrophy, FaChartBar } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

function Result() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const module = await import(`../data/${chapterId}.json`);
        setQuestions(module.default);

        const answers = JSON.parse(localStorage.getItem(`quiz-${chapterId}`)) || {};
        setUserAnswers(answers);
        
        let correctAnswers = 0;
        let totalAttempted = 0;

        module.default.forEach((question, index) => {
          const userAnswer = answers[index];
          if (userAnswer !== undefined) {
            totalAttempted += 1;
            if (question.answer === userAnswer) {
              correctAnswers += 1;
            }
          }
        });

        setScore(correctAnswers);
        setAttempted(totalAttempted);
        setIsLoading(false);

      } catch (error) {
        console.error("Failed to load result data:", error);
        setIsLoading(false);
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

  const calculatePercentage = () => {
    return questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
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
          <h2 className="text-2xl font-bold text-red-500 mb-4">Results Not Available</h2>
          <p className="text-gray-600 mb-6">We couldn&apos;t load the quiz results for this chapter.</p>
          <button
            onClick={() => navigate('/')}
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
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-4">
            Quiz Results
          </h2>
          <p className="text-xl text-gray-600">{formatChapterTitle(chapterId)}</p>
        </motion.div>

        {/* Score Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Total Questions</h3>
              <div className="text-3xl font-bold text-blue-500">{questions.length}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Attempted</h3>
              <div className="text-3xl font-bold text-purple-500">{attempted}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Correct Answers</h3>
              <div className="text-3xl font-bold text-green-500">{score}</div>
            </div>
          </div>
        </motion.div>

        {/* Performance Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-blue-500" />
              Your Performance
            </h3>
            <div className="text-2xl font-bold">
              <span className={calculatePercentage() >= 70 ? 'text-green-500' : 'text-red-500'}>
                {calculatePercentage()}%
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${calculatePercentage()}%` }}
              transition={{ duration: 1 }}
              className={`h-4 rounded-full ${calculatePercentage() >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </motion.div>

        {/* Detailed Question Review */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Question Review
          </h3>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const isCorrect = question.answer === userAnswers[index];
              const isAttempted = userAnswers[index] !== undefined;
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  className={`p-6 rounded-xl shadow-md border-l-4 ${
                    isCorrect ? 'border-green-500 bg-green-50' : 
                    isAttempted ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-lg font-semibold text-gray-800">
                      Q{index + 1}: {question.question}
                    </p>
                    {isAttempted && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  {isAttempted && !isCorrect && (
                    <p className="text-red-600 mb-2">
                      Your answer: <span className="font-medium">{userAnswers[index]}</span>
                    </p>
                  )}

                  <p className="text-green-600 font-medium mb-2">
                    Correct answer: {question.answer}
                  </p>

                  {question.solution && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-blue-800 mb-1">Explanation:</p>
                      <p className="text-sm text-gray-700">{question.solution}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetakeQuiz}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            <FaRedo />
            Retake Quiz
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoToReLearn}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition"
          >
            <FaBookOpen />
            Study Materials
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://relearn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-semibold rounded-full shadow-lg hover:bg-purple-600 transition"
          >
            <FaExternalLinkAlt />
            ReLearn Website
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}

export default Result;