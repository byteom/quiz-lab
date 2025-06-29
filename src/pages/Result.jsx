import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Result() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const module = await import(`../data/${chapterId}.json`);
        const userData = JSON.parse(localStorage.getItem(`quiz-${chapterId}`)) || {};

        setQuestions(module.default);
        setUserAnswers(userData);

        let correct = 0;
        let attemptedCount = 0;

        module.default.forEach((q, i) => {
          if (userData[i] !== undefined) {
            attemptedCount++;
            if (userData[i] === q.answer) correct++;
          }
        });

        setScore(correct);
        setAttempted(attemptedCount);
      } catch (err) {
        console.error("Failed to load result data:", err);
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
    <div className="container mx-auto px-6 py-10 bg-gray-100 rounded-xl shadow-lg">
      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-10 text-center">
        Quiz Results
      </h2>

      <div className="text-center mb-10 space-y-2 text-xl text-gray-800 font-semibold">
        <p>Total Questions: {questions.length}</p>
        <p>Attempted: {attempted}</p>
        <p>Correct: {score}</p>
      </div>

      {/* Grid layout: 2 questions per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {questions.map((q, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === q.answer;

          return (
            <div
              key={index}
              className="min-h-[250px] p-6 bg-white rounded-2xl shadow-lg border-l-8 border-blue-500 flex flex-col justify-between"
            >
              <div>
                <p className="text-2xl font-bold text-gray-800 mb-3">
                  Q{index + 1}: {q.question}
                </p>

                <p className={`text-xl font-medium ${isCorrect ? 'text-green-600' : 'text-green-700'}`}>
                  ✅ Correct Answer: {q.answer}
                </p>

                {userAnswer !== undefined ? (
                  <p className={`text-xl font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    🙋‍♂️ Your Answer: {userAnswer}
                  </p>
                ) : (
                  <p className="text-xl font-medium text-yellow-600">❗ You didn’t answer this question</p>
                )}
              </div>

              <p className="mt-4 text-lg font-bold text-gray-700">
                🧠 Explanation: {q.solution}
              </p>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-14 flex justify-center flex-wrap gap-6">
        <button
          onClick={handleRetakeQuiz}
          className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          🔄 Retake Quiz
        </button>

        <button
          onClick={handleGoToReLearn}
          className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
        >
          📚 Go to ReLearn
        </button>

        <a
          href="https://relearn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-purple-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
        >
          🌐 Visit ReLearn.com
        </a>
      </div>
    </div>
  );
}

export default Result;
