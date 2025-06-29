import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

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
  const [visited, setVisited] = useState(new Set([0]));
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  // Load questions
  useEffect(() => {
    loadQuizData(chapterId).then(setQuestions);
  }, [chapterId]);

  // Track visited questions and scroll on index change
  useEffect(() => {
    setVisited((prev) => new Set(prev).add(currentIndex));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeLeft(15); // reset timer
  }, [currentIndex]);

  // Timer countdown logic
  useEffect(() => {
    if (questions.length === 0 || currentIndex >= questions.length) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          if (currentIndex < questions.length - 1) {
            setCurrentIndex((index) => index + 1);
          }
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, questions.length]);

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
    const confirmSubmit = window.confirm("Are you sure you want to submit the quiz?");
    if (confirmSubmit) {
      localStorage.setItem(`quiz-${chapterId}`, JSON.stringify(userAnswers));
      navigate(`/result/${chapterId}`);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(`quiz-${chapterId}`);
    setUserAnswers({});
    setVisited(new Set([0]));
    setCurrentIndex(0);
    setTimeLeft(15);
  };

  if (questions.length === 0) return <p>Loading questions...</p>;

  return (
    <div className="container mx-auto p-8 flex gap-6">
      {/* Sidebar */}
      <div className="w-1/4 p-6 bg-gradient-to-b from-gray-700 to-gray-500 text-white rounded-2xl shadow-2xl border border-white/10">
        <h2 className="text-2xl font-extrabold mb-4 tracking-wider">Question Navigation</h2>

        {/* Legend */}
        <div className="text-sm font-medium mb-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow"></div> Answered
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-400 rounded-full shadow"></div> Visited
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div> Not Visited
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow"></div> Current
          </div>
        </div>

        {/* Question Numbers */}
        <div className="grid grid-cols-5 gap-3 overflow-y-auto max-h-[320px] custom-scrollbar">
          {questions.map((_, index) => {
            const isCurrent = index === currentIndex;
            const isAnswered = userAnswers[index];
            const isVisited = visited.has(index);

            let buttonColor = '';
            if (isCurrent) {
              buttonColor = 'bg-blue-500 text-white';
            } else if (isAnswered) {
              buttonColor = 'bg-green-500 text-white';
            } else if (isVisited) {
              buttonColor = 'bg-yellow-400 text-black';
            } else {
              buttonColor = 'border-2 border-gray-300 text-gray-700';
            }

            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-10 h-10 rounded-full text-base font-bold transition transform hover:scale-110 shadow-md ${buttonColor}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quiz Content */}
      <div className="w-3/4 pl-4">
        <h2 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-8 drop-shadow-md">
          Quiz - {chapterId.replace('_', ' ')}
        </h2>

        {/* Progress */}
        <p className="text-lg text-gray-700 mb-2 font-semibold tracking-wider">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Timer */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-bold text-red-600">
            ⏱ Time Left: {timeLeft}s
          </p>
          <div className="w-1/3 h-2 bg-gray-300 rounded-full">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-300 mb-8">
          <p className="text-3xl font-semibold text-gray-900 leading-relaxed mb-6">
            Q{currentIndex + 1}: {questions[currentIndex].question}
          </p>
          <div className="mt-4">
            {questions[currentIndex].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className={`block w-full text-left p-4 mb-4 rounded-xl shadow-md text-lg font-medium transition-all duration-300 hover:scale-[1.02] ${
                  userAnswers[currentIndex] === option
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-gray-400 hover:bg-gray-500 text-white disabled:bg-gray-300"
          >
            Previous
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-green-500 hover:bg-green-600 text-white"
          >
            Submit Quiz
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className={`px-5 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
              currentIndex === questions.length - 1
                ? 'bg-blue-300 cursor-not-allowed text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Next
          </button>

          <button
            onClick={handleReset}
            className="px-5 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-red-500 hover:bg-red-600 text-white"
          >
            Reset Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
