// src/components/Calendar.js

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import CSS for styling

const MyCalendar = ({ events }) => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  // Function to get events for the selected date
  const getEventsForDate = (date) => {
    const selectedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    return events.filter((event) => event.date === selectedDate);
  };

  const eventsForSelectedDate = getEventsForDate(date);

  return (
    <div>
      <h2>My Calendar</h2>
      <Calendar onChange={onChange} value={date} />
      <h3>Events on {date.toDateString()}:</h3>
      {eventsForSelectedDate.length > 0 ? (
        <ul>
          {eventsForSelectedDate.map((event) => (
            <li key={event.id}>
              {event.name} - {event.date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events for this date.</p>
      )}
    </div>
  );
};

export default MyCalendar;
