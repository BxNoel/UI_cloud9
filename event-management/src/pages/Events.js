import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";
const EVENTBRITE_API_URL = "https://www.eventbriteapi.com/v3";
const EVENTBRITE_API_KEY = "MP37FMULBZHY7OXFBGMQ";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState("");
  const [newEventStartDate, setNewEventStartDate] = useState("");
  const [newEventStartTime, setNewEventStartTime] = useState("");
  const [newEventEndDate, setNewEventEndDate] = useState("");
  const [newEventEndTime, setNewEventEndTime] = useState("");
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
      const localResponse = await axios.post(`${API_URL}/events/`, {
        name: newEventName,
        date: newEventStartDate,
      });

      const eventbriteResponse = await axios.post(
        `${EVENTBRITE_API_URL}/events/`,
        {
          event: {
            name: { html: newEventName },
            start: {
              timezone: "America/Los_Angeles",
              utc: `${newEventStartDate}T${newEventStartTime}:00Z`,
            },
            end: {
              timezone: "America/Los_Angeles",
              utc: `${newEventEndDate}T${newEventEndTime}:00Z`,
            },
            currency: "USD",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${EVENTBRITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(
        `Event created with ID: ${localResponse.data.id} and Eventbrite ID: ${eventbriteResponse.data.id}`
      );

      setEvents([
        ...events,
        {
          id: localResponse.data.id,
          name: newEventName,
          date: newEventStartDate,
        },
      ]);

      setNewEventName("");
      setNewEventStartDate("");
      setNewEventStartTime("");
      setNewEventEndDate("");
      setNewEventEndTime("");
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
          value={newEventStartDate}
          onChange={(e) => setNewEventStartDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={newEventStartTime}
          onChange={(e) => setNewEventStartTime(e.target.value)}
          required
        />
        <input
          type="date"
          value={newEventEndDate}
          onChange={(e) => setNewEventEndDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={newEventEndTime}
          onChange={(e) => setNewEventEndTime(e.target.value)}
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
