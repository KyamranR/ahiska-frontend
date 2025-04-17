import { useState, useEffect } from "react";
import AhiskaApi from "../api/AhiskaApi.jsx";
import QuestionItem from "./QuestionItem.jsx";
import AskQuestionForm from "./AskQuestionForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { questions: fetchedQuestions } = await AhiskaApi.getAllQAndA();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionCreated = (newQuestion) => {
    setQuestions([newQuestion, ...questions]);
  };

  const handleQuestionAnswered = (updatedQuestion) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  };

  const handleQuestionDeleted = (deletedQuestionId) => {
    setQuestions(questions.filter((q) => q.id !== deletedQuestionId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-center mb-1 drop-shadow-lg">
          Community Q&A
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Ask questions, get answers, help others!
        </p>
      </div>

      {/* Ask a question form */}
      {currentUser && (
        <AskQuestionForm onQuestionCreated={handleQuestionCreated} />
      )}
      <h1 className="text-4xl font-bold text-center mb-1 drop-shadow-lg mt-5">
        Answers
      </h1>
      {/* Questions list */}
      <div className="space-y-6 mt-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              onQuestionAnswered={handleQuestionAnswered}
              onQuestionDeleted={handleQuestionDeleted}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No questions available.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
