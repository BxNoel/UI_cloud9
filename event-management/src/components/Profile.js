import React, { useState, useEffect } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    university: "",
  });

  useEffect(() => {
    // Fetch profile data from API
    // For now, we'll use mock data
    setProfile({
      name: "John Doe",
      email: "johndoe@columbia.edu",
      university: "Columbia University",
    });
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      <p>
        <strong>Name:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>University:</strong> {profile.university}
      </p>
    </div>
  );
};

export default Profile;
