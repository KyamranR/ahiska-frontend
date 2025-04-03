import { useState, useEffect } from "react";
import AhiskaApi from "../api/AhiskaApi.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const QuestionItem = ({ question, onQuestionAnswered, onQuestionDeleted }) => {
  const [answerText, setAnswerText] = useState("");
  const { currentUser } = useAuth();
  const [askedByName, setAskedByName] = useState("");
  const [answeredByNames, setAnsweredByNames] = useState({});

  useEffect(() => {
    if (!currentUser) return;
    const fetchUserNames = async () => {
      try {
        const askedByUser = await AhiskaApi.getCurrentUser(question.askedBy);

        setAskedByName(
          `${askedByUser.user.firstName} ${askedByUser.user.lastName}`
        );

        if (question.answers && question.answers.length > 0) {
          const names = {};
          for (const answer of question.answers) {
            const answeredByUser = await AhiskaApi.getCurrentUser(
              answer.answeredBy
            );

            names[
              answer.id
            ] = `${answeredByUser.user.firstName} ${answeredByUser.user.lastName}`;
          }
          setAnsweredByNames(names);
        }
      } catch (error) {
        console.error("Error fetching user names:", error);
      }
    };

    fetchUserNames();
  }, [question, currentUser]);

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
    <div className="border rounded-lg p-4 mb-4 shadow-md bg-white">
      <p className="font-bold">
        Question: {question.question}{" "}
        {currentUser && (
          <span className="text-gray-500">(Asked by: {askedByName})</span>
        )}
      </p>

      {/* Display multiple answers */}
      {question.answers && question.answers.length > 0 ? (
        <div className="mt-2">
          <p className="font-semibold">Answers:</p>
          <ul className="list-disc pl-5">
            {question.answers.map((answer) => (
              <li key={answer.id} className="text-gray-700">
                {answer.answer}{" "}
                {currentUser && (
                  <span className="text-gray-500">
                    (Answered by: {answeredByNames[answer.id]})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No answers yet.</p>
      )}

      {/* Answer form */}
      {currentUser && (
        <form onSubmit={handleAnswerSubmit} className="mt-2">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Your Answer"
            className="w-full border p-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Submit Answer
          </button>
        </form>
      )}

      {/* Delete Button */}
      {currentUser && currentUser.id === question.askedBy && (
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-md mt-2"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default QuestionItem;
