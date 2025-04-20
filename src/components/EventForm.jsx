import React, { useState, useEffect } from "react";
import AhiskaApi from "../api/AhiskaApi";
import { useAuth } from "../context/AuthContext";

const EventForm = ({ onEventCreated, onCancel, eventToEdit = null }) => {
  const { currentUser } = useAuth();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    created_by: currentUser.id,
  });

  useEffect(() => {
    if (eventToEdit) {
      setEventData({
        title: eventToEdit.title,
        description: eventToEdit.description,
        event_date: eventToEdit.event_date
          ? eventToEdit.event_date.slice(0, 10)
          : "",
        event_time: eventToEdit.time,
        location: eventToEdit.location,
        created_by: currentUser.id,
      });
    }
  }, [eventToEdit, currentUser.id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eventToEdit) {
        await AhiskaApi.updateEvent(eventToEdit.id, eventData);
      } else {
        await AhiskaApi.createEvent(eventData);
      }

      onEventCreated();
    } catch (error) {
      console.error("Error creating/updating event:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-gray-300 text-sm font-bold mb-2"
        >
          Title:
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-300 text-sm font-bold mb-2"
        >
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={eventData.description}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="date"
          className="block text-gray-300 text-sm font-bold mb-2"
        >
          Date:
        </label>
        <input
          id="date"
          type="date"
          name="event_date"
          value={eventData.event_date}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="time"
          className="block text-gray-300 text-sm font-bold mb-2"
        >
          Time:
        </label>
        <input
          id="time"
          type="text"
          name="event_time"
          value={eventData.event_time}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="location"
          className="block text-gray-300 text-sm font-bold mb-2"
        >
          Location:
        </label>
        <input
          id="location"
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="bg-purple-900 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mr-2"
      >
        {eventToEdit ? "Update Event" : "Create Event"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
      >
        Cancel
      </button>
    </form>
  );
};

export default EventForm;
