import React, { useState, useEffect } from "react";
import AhiskaApi from "../api/AhiskaApi";
import { useAuth } from "../context/AuthContext";
import EventForm from "./EventForm";
import UserList from "./UserList";
import FeedbackList from "./FeedbackList";
import EditEventForm from "./EditEventForm";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [tab, setTab] = useState("events");

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

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      {currentUser?.role === "admin" ? (
        <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-6">
          <h1 className="text-4xl font-bold text-center text-white mb-10 drop-shadow-lg">
            Admin Panel
          </h1>

          {/* Tabs Header */}
          <Box sx={{ width: "100%", bgcolor: "transparent" }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              aria-label="admin panel tabs"
              centered
              slotProps={{
                indicator: {
                  style: {
                    backgroundColor: "#8b5cf6",
                  },
                },
              }}
              sx={{
                "& .MuiTab-root": {
                  color: "#a1a1aa",
                  fontWeight: "bold",
                },
                "& .Mui-selected": {
                  color: "#c084fc !important",
                },
                "& .MuiTab-root:hover": {
                  color: "#d8b4fe",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#8b5cf6",
                },
              }}
            >
              <Tab value="events" label="Events" />
              <Tab value="feedback" label="Feedback" />
              <Tab value="users" label="Users" />
            </Tabs>
          </Box>

          <div className="mt-6">
            {tab === "events" && (
              <div>
                <div className="mb-4">
                  {!showEventForm && !editingEvent && (
                    <button
                      onClick={handleCreateEvent}
                      className="bg-purple-900 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Create Event
                    </button>
                  )}

                  {showEventForm && editingEvent === null && (
                    <EventForm
                      onEventCreated={handleEventCreated}
                      onCancel={() => setShowEventForm(false)}
                    />
                  )}

                  {editingEvent && (
                    <EditEventForm
                      eventToEdit={editingEvent}
                      onEventUpdated={handleEventCreated}
                      onCancel={() => {
                        setEditingEvent(null);
                        setShowEventForm(false);
                      }}
                    />
                  )}
                </div>

                <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/30 transition duration-300">
                  <h2 className="text-xl font-semibold mb-2">Events</h2>
                  <ul>
                    {events.map((event) => (
                      <li
                        key={event.id}
                        className="flex justify-between items-center mt-2"
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
              </div>
            )}

            {tab === "feedback" && (
              <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/30 transition duration-300">
                <h2 className="text-xl font-semibold mb-2">Feedback</h2>
                <ul>
                  {feedback.map((fb) => (
                    <li
                      key={fb.id}
                      className="flex justify-between items-center mt-2"
                    >
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
            )}

            {tab === "users" && (
              <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/30 transition duration-300 flex-wrap break-word">
                <UserList users={users} refreshUsers={fetchData} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>You do not have permission to access this page.</p>
      )}
    </div>
  );
};

export default AdminPanel;
