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
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await AhiskaApi.getAllEvents();
        setEvents(response.events);
        response.events.forEach(async (event) => {
          await fetchFeedback(event.id);
        });
        if (currentUser) {
          await fetchUserRegistrations();
        } else {
          setLoadingRegistrations(false);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoadingRegistrations(false);
      }
    };

    const fetchUserRegistrations = async () => {
      try {
        const registrationsData = await AhiskaApi.getUserRegistrations(
          currentUser.id
        );
        if (registrationsData?.registrations) {
          const registrations = {};
          registrationsData.registrations.forEach((reg) => {
            registrations[reg.eventId] = true;
          });
          setUserRegistrations(registrations);
        }
      } catch (error) {
        console.error("Error fetching user registrations:", error);
      } finally {
        setLoadingRegistrations(false);
      }
    };

    fetchInitialData();
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

  const toggleFeedbackForm = (eventId) => {
    setShowFeedbackForm((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // const fetchUserRegistrations = async () => {
  //   try {
  //     const registrationsData = await AhiskaApi.getUserRegistrations(
  //       currentUser.id
  //     );
  //     if (registrationsData?.registrations) {
  //       const registrations = {};
  //       registrationsData.registrations.forEach((reg) => {
  //         registrations[reg.eventId] = true;
  //       });
  //       setUserRegistrations(registrations);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user registrations:", error);
  //   } finally {
  //     setLoadingRegistrations(false);
  //   }

  //   fetchEvents();
  // };

  const handleRegister = async (eventId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setIsRegistering((prev) => ({ ...prev, [eventId]: true }));
    const wasRegistered = userRegistrations[eventId];

    console.log("User registrations:", wasRegistered);
    try {
      if (wasRegistered) {
        setUserRegistrations((prev) => {
          const updatedRegistrations = { ...prev };
          delete updatedRegistrations[eventId];
          return updatedRegistrations;
        });
        await AhiskaApi.unregisterFromEvent(eventId);
      } else {
        setUserRegistrations((prev) => ({
          ...prev,
          [eventId]: true,
        }));
        await AhiskaApi.registerForEvent(eventId);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 drop-shadow-lg">
        Upcoming Events
      </h1>
      <div className="max-w-6xl mx-auto space-y-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/30 transition duration-300"
          >
            <h2 className="text-2xl font-bold text-purple-300 mb-2">
              {event.title}
            </h2>
            <p className="text-gray-300 mb-2">{event.description}</p>
            <div className="text-sm text-gray-400 space-y-1 mb-4">
              <p>
                Date:{" "}
                {new Date(event.event_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>Time: {event.event_time}</p>
              <p>Location: {event.location}</p>
            </div>
            <button
              onClick={() => handleRegister(event.id)}
              className={`${
                userRegistrations[event.id]
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-2 rounded-lg shadow transition mr-2`}
              disabled={isRegistering[event.id] || loadingRegistrations}
            >
              {loadingRegistrations
                ? "Loading..."
                : isRegistering[event.id]
                ? "Processing..."
                : userRegistrations[event.id]
                ? "Unregister"
                : "Register"}
            </button>
            {currentUser && (
              <>
                <button
                  onClick={() => toggleFeedbackForm(event.id)}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 px-4 py-2 rounded-lg text-white shadow-lg mt-4"
                >
                  {showFeedbackForm[event.id] ? "Cancel" : "Add Feedback"}
                </button>

                {showFeedbackForm[event.id] && (
                  <div className="mt-4">
                    <textarea
                      value={feedbackText[event.id] || ""}
                      onChange={(e) =>
                        setFeedbackText((prevTexts) => ({
                          ...prevTexts,
                          [event.id]: e.target.value,
                        }))
                      }
                      placeholder="Leave feedback..."
                      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-gray-400 mb-2"
                    />
                    <button
                      onClick={() => handleFeedbackSubmit(event.id)}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 px-4 py-2 rounded-lg text-white shadow-lg"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </>
            )}

            {eventFeedback[event.id] && (
              <div className="bg-gray-700 mt-3 space-y-2 p-5 rounded-md">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">
                  Feedback:
                </h3>

                <ul className="list-inside text-gray-300 space-y-1">
                  {eventFeedback[event.id].map((feedback) => (
                    <li key={feedback.id}>
                      <span className="font-medium text-white">
                        {feedback.firstName} {feedback.lastName}:
                      </span>{" "}
                      {feedback.content}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
