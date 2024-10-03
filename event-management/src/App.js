import React, { useEffect, useState } from "react";
import "./App.css";

import axios from "axios";
const API_URL = "http://localhost:8000";

function App() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOrganizations = async (skip = 0, limit = 100) => {
    try {
      console.log(`${API_URL}/organizations/`);
      const response = await axios.get(`${API_URL}/organizations/`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) return <p>Loading organizations...</p>;
  if (error) return <p>Error fetching organizations: {error.message}</p>;

  return (
    <div>
      <h2>Organizations</h2>
      <ul>
        {organizations.map((org) => (
          <li key={org.organization_name}>
            <strong>{org.organization_name}</strong>: {org.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
