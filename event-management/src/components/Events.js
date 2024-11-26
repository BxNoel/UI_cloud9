import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/`);
        setEvents(response.data.items);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/events/`, {
        name: newEventName,
        date: newEventDate,
      });
      alert(`Event created with ID: ${response.data.id}`);
      // Refresh events after creation
      setEvents([
        ...events,
        { id: response.data.id, name: newEventName, date: newEventDate },
      ]);
      setNewEventName("");
      setNewEventDate("");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error fetching events: {error.message}</p>;

  return (
    <div>
      <h2>Events</h2>
      <form onSubmit={createEvent}>
        <input
          type="text"
          placeholder="Event Name"
          value={newEventName}
          onChange={(e) => setNewEventName(e.target.value)}
          required
        />
        <input
          type="date"
          value={newEventDate}
          onChange={(e) => setNewEventDate(e.target.value)}
          required
        />
        <button type="submit">Create Event</button>
      </form>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.name} - {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
