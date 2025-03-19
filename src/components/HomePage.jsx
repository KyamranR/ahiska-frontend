import { useEffect, useState } from "react";
import AhiskaApi from "../api/AhiskaApi";
import { useAuth } from "../context/AuthContext.jsx";

const HomePage = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await AhiskaApi.request("events");
        setEvents(res.events);
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Events Section */}
      <div className="mt-10 w-3/4">
        <h2 className="text-3xl font-bold text-center">Upcoming Events</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {events.length ? (
            events.map((event) => (
              <div key={event.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-gray-600">{event.date}</p>
                <p className="text-gray-600">{event.time}</p>
                <p>{event.description}</p>

                {currentUser && (
                  <div className="mt-4">
                    <button className="bg-green-500 text-white px-3 py-2 rounded mr-2">
                      Register
                    </button>
                    <button className="bg-yellow-500 text-white px-3 py-2 rounded">
                      Leave Feedback
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-centers">No events available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
