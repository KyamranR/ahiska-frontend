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
  const [isRegistering, setIsRegistering] = useState({});

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
      if (!registrationsData || !registrationsData.registrations) {
        return;
      }

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
    console.log("Register button clicked for event ID:", eventId);
    console.log("Current User ID:", currentUser.id);
    setIsRegistering((prev) => ({ ...prev, [eventId]: true }));
    const wasRegistered = userRegistrations[eventId];

    try {
      if (wasRegistered) {
        console.log("Unregistering user from event ID:", eventId);
        await AhiskaApi.unregisterFromEvent(eventId);
        console.log("Successfully unregistered.");
        setUserRegistrations((prev) => {
          const updatedRegistrations = { ...prev };
          delete updatedRegistrations[eventId];
          return updatedRegistrations;
        });
      } else {
        console.log("Registering user for event ID:", eventId);
        await AhiskaApi.registerForEvent(eventId);
        console.log("Successfully registered.");
        setUserRegistrations((prev) => ({
          ...prev,
          [eventId]: true,
        }));
      }

      await fetchUserRegistrations();
    } catch (error) {
      console.error("Error registering for event:", error);
      alert(
        `Registration failed: ${
          error?.message || "An unexpected error occurred."
        }`
      );
    } finally {
      setIsRegistering((prev) => ({ ...prev, [eventId]: false }));
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

      // alert("Feedback submitted!");

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
          <p>
            Date:{" "}
            {new Date(event.event_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>Time: {event.time}</p>
          <p>Location: {event.location}</p>
          <button
            onClick={() => handleRegister(event.id)}
            className={
              userRegistrations[event.id]
                ? "bg-red-500 text-white px-4 py-2 rounded mt-2 mr-2"
                : "bg-blue-500 text-white px-4 py-2 rounded mt-2 mr-2"
            }
            disabled={isRegistering[event.id]}
          >
            {isRegistering[event.id]
              ? "Processing..."
              : userRegistrations[event.id]
              ? "Unregister"
              : "Register"}
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
                  <li key={feedback.id}>
                    {feedback.content} - {feedback.firstName}{" "}
                    {feedback.lastName}
                  </li>
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
