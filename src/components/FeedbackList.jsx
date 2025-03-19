import React from "react";
import AhiskaApi from "../api/AhiskaApi";

const FeedbackList = ({ feedback, refreshFeedback }) => {
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await AhiskaApi.deleteFeedback(feedbackId);
      refreshFeedback();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Feedback</h2>
      <ul className="divide-y divide-gray-200">
        {feedback.map((fb) => (
          <li key={fb.id} className="py-4 flex items-center justify-between">
            <div className="flex-grow">
              <p className="text-gray-800">{fb.comment}</p>
              <p className="text-sm text-gray-600">Event ID: {fb.eventId}</p>
            </div>
            <button
              onClick={() => handleDeleteFeedback(fb.id)}
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
