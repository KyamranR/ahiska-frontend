import React from "react";
import AhiskaApi from "../api/AhiskaApi";

const FeedbackList = ({ eventId, feedback, refreshFeedback }) => {
  const handleDeleteFeedback = async (eventId, feedbackId) => {
    try {
      if (window.confirm("Are you sure you want to delete this feedback?")) {
        await AhiskaApi.deleteFeedback(eventId, feedbackId);
        refreshFeedback();
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Feedback</h2>
      <ul>
        {feedback.map((fb) => (
          <li key={fb.id} className="flex justify-between items-center mt-2">
            <div className="flex-grow">
              <p>{fb.content}</p>
            </div>
            <button
              onClick={() => handleDeleteFeedback(fb.eventId, fb.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackList;
