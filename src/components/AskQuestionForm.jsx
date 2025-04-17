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
    <div className="bg-gray-600/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/30 transition duration-300">
      <h3 className="text-lg font-semibold">Ask a Question</h3>
      <form onSubmit={handleSubmit} className="mt-2">
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Your Question"
          className="bg-gray-800 w-full border p-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 px-4 py-2 rounded-lg text-white shadow-lg"
        >
          Ask
        </button>
      </form>
    </div>
  );
};

export default AskQuestionForm;
