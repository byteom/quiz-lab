import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaRedo, FaBookOpen, FaExternalLinkAlt, FaTrophy, FaChartBar, FaFilePdf } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Function to call Gemini API for recommendations
const getAIRecommendations = async (chapterId, score, totalQuestions, weakAreas, questions, userAnswers) => {
  try {
    // Prepare the prompt for Gemini
    const prompt = `Provide learning recommendations based on quiz results:
    - Chapter: ${chapterId}
    - Score: ${score}/${totalQuestions} (${Math.round((score/totalQuestions)*100)}%)
    - Weak Areas: ${weakAreas.join(', ')}
    - Questions answered incorrectly: ${questions.filter((q, i) => userAnswers[i] && q.answer !== userAnswers[i]).length}
    
    Provide 3 personalized recommendations to improve understanding. Focus on:`;

    // Call your Gemini API endpoint
    const response = await fetch('YOUR_GEMINI_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers
      },
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.7,
        maxTokens: 150
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.text?.split('\n').filter(rec => rec.trim()) || [
      "Review the chapter materials thoroughly",
      "Practice with additional exercises",
      "Focus on your weak areas identified"
    ];
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    // Fallback recommendations
    return [
      "Complete the chapter review materials",
      "Try the practice exercises for this topic",
      weakAreas.length > 0 ? `Focus on ${weakAreas.join(', ')} concepts` : "Review incorrect answers"
    ];
  }
};

function Result() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [marksData, setMarksData] = useState({ total: 0, obtained: 0 });
  const pdfRef = useRef();

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
        let totalMarks = 0;
        let obtainedMarks = 0;
        const incorrectTags = new Set();

        module.default.forEach((question, index) => {
          const userAnswer = answers[index];
          const questionMarks = question.marks || 1; // Default to 1 mark if not specified
          
          if (userAnswer !== undefined) {
            totalAttempted += 1;
            totalMarks += questionMarks;
            
            if (question.answer === userAnswer) {
              correctAnswers += 1;
              obtainedMarks += questionMarks;
            } else {
              // Collect tags from incorrectly answered questions
              if (question.tags) {
                question.tags.forEach(tag => incorrectTags.add(tag));
              }
            }
          } else {
            // Unattempted questions still contribute to total marks
            totalMarks += questionMarks;
          }
        });

        setScore(correctAnswers);
        setAttempted(totalAttempted);
        setWeakAreas(Array.from(incorrectTags));
        setMarksData({ total: totalMarks, obtained: obtainedMarks });
        
        // Get AI recommendations
        const recs = await getAIRecommendations(
          chapterId,
          correctAnswers,
          module.default.length,
          Array.from(incorrectTags),
          module.default,
          answers
        );
        setRecommendations(recs);
        
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

  const downloadPDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`quiz-results-${chapterId}.pdf`);
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
          <p className="text-gray-600 mb-6">We couldn't load the quiz results for this chapter.</p>
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
      <div className="max-w-4xl mx-auto" ref={pdfRef}>
        {/* PDF Header - Only visible in PDF export */}
        <div className="hidden print:block">
          <h1 className="text-3xl font-bold text-center mb-2">Quiz Results</h1>
          <h2 className="text-xl text-center mb-8">{formatChapterTitle(chapterId)}</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 print:mb-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-4 print:text-black print:bg-none">
            Quiz Results
          </h2>
          <p className="text-xl text-gray-600 print:text-black">{formatChapterTitle(chapterId)}</p>
        </motion.div>

        {/* Score Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 print:mb-6"
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

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Marks</h3>
              <div className="text-3xl font-bold text-yellow-500">
                {marksData.obtained}/{marksData.total}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg mb-12 print:shadow-none print:border print:border-gray-300"
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

        {/* Smart Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-indigo-50 p-6 rounded-xl shadow-lg mb-12 border-l-4 border-indigo-500 print:break-inside-avoid"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Smart Recommendations
            </h3>
            <p className="text-gray-600 mb-4">Based on your performance, we recommend:</p>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start"
                >
                  <span className="text-indigo-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{rec}</span>
                </motion.li>
              ))}
            </ul>
            {weakAreas.length > 0 && (
              <div className="mt-4 pt-4 border-t border-indigo-100">
                <p className="text-sm font-semibold text-gray-600 mb-2">Focus Areas:</p>
                <div className="flex flex-wrap gap-2">
                  {weakAreas.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Detailed Question Review */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12 print:break-before-page"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 print:text-black">
            <FaTrophy className="text-yellow-500 print:text-black" />
            Question Review
          </h3>

          <div className="space-y-6 print:space-y-4">
            {questions.map((question, index) => {
              const isCorrect = question.answer === userAnswers[index];
              const isAttempted = userAnswers[index] !== undefined;
              const questionMarks = question.marks || 1;
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  className={`p-6 rounded-xl shadow-md border-l-4 print:shadow-none print:border print:border-gray-300 ${
                    isCorrect ? 'border-green-500 bg-green-50 print:bg-white' : 
                    isAttempted ? 'border-red-500 bg-red-50 print:bg-white' : 'border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        Q{index + 1}: {question.question}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Marks: {isAttempted && !isCorrect ? '0' : questionMarks}/{questionMarks}
                      </p>
                    </div>
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
          className="flex flex-col sm:flex-row justify-center gap-4 print:hidden"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition"
          >
            <FaFilePdf />
            Export as PDF
          </motion.button>
          
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
        </motion.div>
      </div>
    </div>
  );
}

export default Result;