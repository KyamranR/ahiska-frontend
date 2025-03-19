import React, { useState, useEffect } from "react";
import AhiskaApi from "../api/AhiskaApi";
import { useAuth } from "../context/AuthContext";
import EventForm from "./EventForm";
import UserList from "./UserList";
import FeedbackList from "./FeedbackList";

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const usersData = await AhiskaApi.getAllUsers();
      setUsers(usersData.users);

      const eventsData = await AhiskaApi.getAllEventsAdmin();
      setEvents(eventsData.events);

      const allFeedback = [];
      for (const event of eventsData.events) {
        const feedbackData = await AhiskaApi.getFeedback(event.id);
        allFeedback.push(...feedbackData.feedback);
      }
      setFeedback(allFeedback);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreateEvent = () => {
    setShowEventForm(true);
  };
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };
  const handleEventCreated = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    fetchData();
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await AhiskaApi.deleteEventAdmin(eventId);
      fetchData();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await AhiskaApi.deleteFeedback(feedbackId);
      fetchData();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {currentUser?.role === "admin" ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

          <div className="mb-4">
            <button
              onClick={handleCreateEvent}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingEvent ? "Edit Event" : "Create Event"}
            </button>
            {showEventForm && (
              <EventForm
                onEventCreated={handleEventCreated}
                eventToEdit={editingEvent}
              />
            )}
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Events</h2>
            <ul>
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex justify-between items-center"
                >
                  {event.title}
                  <div>
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Feedback</h2>
            <ul>
              {feedback.map((fb) => (
                <li key={fb.id} className="flex justify-between items-center">
                  {fb.content}
                  <button
                    onClick={() => handleDeleteFeedback(fb.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <button
              onClick={handleCreateEvent}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingEvent ? "Edit Event" : "Create Event"}
            </button>
            {showEventForm && (
              <EventForm
                onEventCreated={handleEventCreated}
                eventToEdit={editingEvent}
              />
            )}
          </div>

          <div className="mb-4">
            <UserList users={users} refreshUsers={fetchData} />
          </div>
        </div>
      ) : (
        <p>You do not have permission to access this page.</p>
      )}
    </div>
  );
};

export default AdminPanel;
