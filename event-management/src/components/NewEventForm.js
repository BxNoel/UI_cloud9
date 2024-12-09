import React, { useState } from "react";
import axios from "axios";

const EVENTBRITE_API_URL = "https://www.eventbriteapi.com/v3";

const EventForm = ({ accessToken, organizationId }) => {
  const [newEventName, setNewEventName] = useState("");
  const [newEventStartDate, setNewEventStartDate] = useState("");
  const [newEventStartTime, setNewEventStartTime] = useState("");
  const [newEventEndDate, setNewEventEndDate] = useState("");
  const [newEventEndTime, setNewEventEndTime] = useState("");
  const [error, setError] = useState(null);

  // Function to create an event
  const createEvent = async (e) => {
    e.preventDefault();
    try {
      console.log(
        `${EVENTBRITE_API_URL}/organizations/${organizationId}/events/`
      );
      const eventbriteResponse = await axios.post(
        `${EVENTBRITE_API_URL}/organizations/${organizationId}/events/`,
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
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(`Event created with Eventbrite ID: ${eventbriteResponse.data.id}`);

      setNewEventName("");
      setNewEventStartDate("");
      setNewEventStartTime("");
      setNewEventEndDate("");
      setNewEventEndTime("");
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Failed to create event. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create New Event</h2>
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default EventForm;
