import { useState, useEffect } from "react";
import AhiskaApi from "../api/AhiskaApi.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const QuestionItem = ({ question, onQuestionAnswered, onQuestionDeleted }) => {
  const [answerText, setAnswerText] = useState("");
  const { currentUser } = useAuth();
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const { answers: updatedAnswers } = await AhiskaApi.answerQuestion(
        question.id,
        answerText
      );

      onQuestionAnswered({ ...question, answers: updatedAnswers });
      setAnswerText("");
    } catch (error) {
      console.error("Error answering question:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await AhiskaApi.deleteQuestion(question.id);
        onQuestionDeleted(question.id);
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/30 transition duration-300">
      <p className="text-lg font-semibold text-white-900 dark:text-white">
        Question: {question.question}{" "}
        <span className="text-sm text-gray-500 mb-2">
          (Asked by: {question.askedByFirstName} {question.askedByLastName})
        </span>
      </p>

      {/* Display multiple answers */}
      {question.answers?.length > 0 ? (
        <div className="mt-3 space-y-2">
          {question.answers.map((answer) => (
            <div
              key={answer.id}
              className="bg-gray-700 p-3 rounded-md shadow-sm"
            >
              <p className="text-indigo-100">{answer.answer}</p>
              <p className="text-xs text-gray-400 mt-1">
                Answered by: {answer.answeredByFirstName}{" "}
                {answer.answeredByLastName}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No answers yet.</p>
      )}

      {/* Answer form */}
      {currentUser && (
        <>
          <button
            onClick={() => setShowAnswerForm(!showAnswerForm)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 px-4 py-2 rounded-md text-white shadow-lg mt-2 mr-3"
          >
            {showAnswerForm ? "Close" : "Add Answer"}
          </button>

          {showAnswerForm && (
            <form onSubmit={handleAnswerSubmit} className="mt-2">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Your Answer"
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray dark:bg-gray-800 text-white dark:text-white p-2 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                rows={3}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 px-4 py-2 rounded-md text-white shadow-lg"
              >
                Submit Answer
              </button>
            </form>
          )}
        </>
      )}

      {/* Delete Button */}
      {currentUser && currentUser.id === question.askedBy && (
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-2 rounded-md mt-2"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default QuestionItem;
