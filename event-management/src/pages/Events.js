import React, { useEffect, useState } from "react";
import EventForm from "../components/EventForm"; // Import your EventForm component

const Events = () => {
  const [accessToken, setAccessToken] = useState("");
  const [organizationId, setOrganizationId] = useState("");

  useEffect(() => {
    // Check for access_token and organization_id in the URL when redirected back from OAuth
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    const orgId = params.get("organization_id");

    if (token && orgId) {
      // Save both the access token and organization ID in local storage
      localStorage.setItem("eventbrite_access_token", token);
      localStorage.setItem("eventbrite_organization_id", orgId);
      setAccessToken(token);
      setOrganizationId(orgId);
      console.log("Access Token:", token);
      console.log("Organization ID:", orgId);

      // Clear URL parameters to avoid confusion on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check if an access token exists in local storage
      const storedToken = localStorage.getItem("eventbrite_access_token");
      const storedOrgId = localStorage.getItem("eventbrite_organization_id");

      if (storedToken && storedOrgId) {
        // If both values exist, set them in state
        setAccessToken(storedToken);
        setOrganizationId(storedOrgId);
        console.log("Stored Access Token:", storedToken);
        console.log("Stored Organization ID:", storedOrgId);
      } else {
        // If no token is found, redirect to login
        window.location.href = "http://localhost:3000/login"; // Redirect to backend login route
      }
    }
  }, []);

  return (
    <div>
      <h1>My Eventbrite App</h1>
      {accessToken && organizationId ? (
        <EventForm accessToken={accessToken} organizationId={organizationId} /> // Pass both values to EventForm
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

export default Events;
