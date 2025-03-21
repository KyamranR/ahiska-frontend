import React, { useState, useEffect } from "react";
import AhiskaApi from "../api/AhiskaApi";

const EditEventForm = ({ eventToEdit, onEventUpdated, onCancel }) => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  useEffect(() => {
    if (eventToEdit) {
      setEventData({
        title: eventToEdit?.title || "",
        description: eventToEdit?.description || "",
        date: eventToEdit?.date ? eventToEdit.date.split("T")[0] : "",
        time: eventToEdit?.time || "",
        location: eventToEdit?.location || "",
      });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AhiskaApi.updateEvent(eventToEdit.id, eventData);
      onEventUpdated();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description:
        </label>
        <textarea
          name="description"
          value={eventData.description}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date:
        </label>
        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Time:
        </label>
        <input
          type="time"
          name="time"
          value={eventData.time}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Location:
        </label>
        <input
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Update Event
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Cancel
      </button>
    </form>
  );
};

export default EditEventForm;
