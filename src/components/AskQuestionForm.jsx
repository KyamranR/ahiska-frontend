import { useState } from "react";
import AhiskaApi from "../api/AhiskaApi.jsx";

const AskQuestionForm = ({ onQuestionCreated }) => {
  const [questionText, setQuestionText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { question: newQuestion } = await AhiskaApi.createQuestion(
        questionText
      );
      onQuestionCreated(newQuestion);
      setQuestionText("");
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Ask a Question</h3>
      <form onSubmit={handleSubmit} className="mt-2">
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Your Question"
          className="w-full border p-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
        >
          Ask
        </button>
      </form>
    </div>
  );
};

export default AskQuestionForm;
