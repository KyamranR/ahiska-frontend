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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center">Q&A</h2>

      {/* Ask a question form */}
      {currentUser && (
        <AskQuestionForm onQuestionCreated={handleQuestionCreated} />
      )}

      {/* Questions list */}
      <div className="mt-4">
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
          <p className="text-center text-gray-500">No questions available.</p>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
