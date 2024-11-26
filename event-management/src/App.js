import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";

import Events from "./components/Events";
import MyCalendar from "./components/Calendar";
import Profile from "./components/Profile";

const API_URL = "http://localhost:8000";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axios.get(`${API_URL}/events/`);
        setEvents(eventResponse.data.items);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createEvent = async (eventData) => {
    try {
      const response = await axios.post(`${API_URL}/events/`, eventData);
      alert(`Event created with ID: ${response.data.id}`);
      setEvents([...events, response.data]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

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
              <Link to="/my-calendar">My Calendar</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/events">
            <Events events={events} createEvent={createEvent} />
          </Route>
          <Route path="/my-calendar">
            <MyCalendar events={events} />
          </Route>
          <Route path="/profile" component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

const Home = () => <h2>Welcome to Columbia Events</h2>;
const MyCalendar = () => <h2>My Calendar</h2>;

export default App;
