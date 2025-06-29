import { useState } from 'react';

function AdminUpload() {
  const [quizMeta, setQuizMeta] = useState({
    title: '',
    subject: '',
    level: 'easy',
  });

  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], answer: '', solution: '' }
  ]);

  const handleMetaChange = (e) => {
    setQuizMeta({ ...quizMeta, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], answer: '', solution: '' }
    ]);
  };

  const handleSubmit = () => {
    const dataToSave = {
      ...quizMeta,
      questions,
    };

    // Save under a unique localStorage key
    const key = `custom-quiz-${quizMeta.subject}-${quizMeta.title}`.replace(/\s+/g, '_').toLowerCase();
    localStorage.setItem(key, JSON.stringify(dataToSave));

    alert(`Quiz saved locally with key: ${key}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Admin Quiz Creator</h2>

      {/* Quiz Meta Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Quiz Title"
          value={quizMeta.title}
          onChange={handleMetaChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject (e.g., DBMS)"
          value={quizMeta.subject}
          onChange={handleMetaChange}
          className="p-2 border rounded"
        />
        <select
          name="level"
          value={quizMeta.level}
          onChange={handleMetaChange}
          className="p-2 border rounded"
        >
          <option value="easy">Easy</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Questions */}
      {questions.map((q, index) => (
        <div key={index} className="border p-4 mb-6 rounded bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Question {index + 1}</h3>
          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />

          <div className="grid grid-cols-2 gap-2 mb-2">
            {q.options.map((opt, optIdx) => (
              <input
                key={optIdx}
                type="text"
                placeholder={`Option ${optIdx + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(index, optIdx, e.target.value)}
                className="p-2 border rounded"
              />
            ))}
          </div>

          <input
            type="text"
            placeholder="Correct answer"
            value={q.answer}
            onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />

          <textarea
            placeholder="Explanation / Solution"
            value={q.solution}
            onChange={(e) => handleQuestionChange(index, 'solution', e.target.value)}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
      ))}

      <div className="flex justify-between">
        <button
          onClick={addQuestion}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ➕ Add Another Question
        </button>

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ✅ Save Quiz
        </button>
      </div>
    </div>
  );
}

export default AdminUpload;
