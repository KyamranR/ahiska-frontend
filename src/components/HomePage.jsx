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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      {/* Events Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-10 drop-shadow-lg">
          Upcoming Events
        </h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.length ? (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/30 transition duration-300"
              >
                <h3 className="text-xl font-bold mb-2 text-purple-300">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-400 mb-1">
                  {new Date(event.event_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-400 mb-3">{event.event_time}</p>
                <p className="text-gray-300">{event.description}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No events available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
