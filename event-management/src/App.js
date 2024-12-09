import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventCalendar from "./pages/Calendar";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
            <li>
              <Link to="/calendar">My Calendar</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/events"
            element={<Events events={events} createEvent={createEvent} />}
          />
          <Route path="/calendar" element={<EventCalendar events={events} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
