import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AhiskaApi from "../api/AhiskaApi";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [feedbackText, setFeedbackText] = useState({});
  const [eventFeedback, setEventFeedback] = useState({});
  const [userRegistrations, setUserRegistrations] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await AhiskaApi.getAllEvents();
        setEvents(response.events);
        response.events.forEach(async (event) => {
          await fetchFeedback(event.id);
        });
        if (currentUser) {
          await fetchUserRegistrations();
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [currentUser]);

  const fetchFeedback = async (eventId) => {
    try {
      const feedbackData = await AhiskaApi.getFeedback(eventId);
      setEventFeedback((prevFeedbacks) => ({
        ...prevFeedbacks,
        [eventId]: feedbackData.feedback,
      }));
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const registrationsData = await AhiskaApi.getUserRegistrations(
        currentUser.id
      );
      const registrations = {};
      registrationsData.registrations.forEach((reg) => {
        registrations[reg.eventId] = true;
      });
      setUserRegistrations(registrations);
    } catch (error) {
      console.error("Error fetching user registrations:", error);
    }
  };

  const handleRegister = async (eventId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      if (userRegistrations[eventId]) {
        await AhiskaApi.unregisterFromEvent(eventId);
        setUserRegistrations((prev) => ({ ...prev, [eventId]: false }));
      } else {
        await AhiskaApi.registerForEvent(eventId);
        setUserRegistrations((prev) => ({ ...prev, [eventId]: true }));
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Registration failed.");
    }
  };

  const handleFeedbackSubmit = async (eventId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await AhiskaApi.addFeedback(eventId, {
        content: feedbackText[eventId] || "",
      });
      alert("Feedback submitted!");
      setFeedbackText((prevTexts) => ({ ...prevTexts, [eventId]: "" }));
      await fetchFeedback(eventId);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Feedback submission failed.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      {events.map((event) => (
        <div key={event.id} className="border p-4 mb-4">
          <h2 className="text-lg font-semibold">{event.title}</h2>
          <p>{event.description}</p>
          <p>Date: {event.date}</p>
          <p>Time: {event.time}</p>
          <p>Location: {event.location}</p>
          <button
            onClick={() => handleRegister(event.id)}
            className={
              userRegistrations[event.id]
                ? "bg-gray-500 text-white px-4 py-2 rounded mt-2 mr-2"
                : "bg-blue-500 text-white px-4 py-2 rounded mt-2 mr-2"
            }
          >
            {userRegistrations[event.id] ? "Registered" : "Register"}
          </button>
          {currentUser && (
            <div className="mt-2">
              <textarea
                value={feedbackText[event.id] || ""}
                onChange={(e) =>
                  setFeedbackText((prevTexts) => ({
                    ...prevTexts,
                    [event.id]: e.target.value,
                  }))
                }
                placeholder="Leave feedback..."
                className="border p-2 w-full"
              />
              <button
                onClick={() => handleFeedbackSubmit(event.id)}
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              >
                Submit Feedback
              </button>
            </div>
          )}
          {eventFeedback[event.id] && (
            <div className="mt-2">
              <h3 className="text-lg font-semibold">Feedback:</h3>
              <ul>
                {eventFeedback[event.id].map((feedback) => (
                  <li key={feedback.id}>{feedback.content}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventsPage;
