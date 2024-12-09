require("dotenv").config();
const express = require("express");
const { exec } = require("child_process"); // Import child_process to execute cURL commands
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const EVENTBRITE_API_KEY = process.env.EVENTBRITE_API_KEY;
const EVENTBRITE_CLIENT_SECRET = process.env.EVENTBRITE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth/redirect"; // Your redirect URI

// Step 1: Redirect users to Eventbrite's authorization URL
app.get("/login", (req, res) => {
  const authUrl = `https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=${EVENTBRITE_API_KEY}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
});

// Step 2: Handle the redirect from Eventbrite
app.get("/oauth/redirect", (req, res) => {
  const authCode = req.query.code;

  if (!authCode) {
    return res.status(400).send("Authorization code not provided.");
  }
  console.log("Authorization Code:", authCode);

  // Construct the cURL command
  const curlCommand = `curl --request POST \
    --url 'https://www.eventbrite.com/oauth/token' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data 'grant_type=authorization_code' \
    --data 'client_id=${EVENTBRITE_API_KEY}' \
    --data 'client_secret=${EVENTBRITE_CLIENT_SECRET}' \
    --data 'code=${authCode}' \
    --data 'redirect_uri=${REDIRECT_URI}'`;

  // Execute the cURL command
  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing cURL command:", error);
      return res.status(500).send("Error obtaining access token.");
    }

    // Parse the output from cURL
    try {
      const responseData = JSON.parse(stdout);
      const accessToken = responseData.access_token;
      console.log("Access Token:", accessToken);

      // Retrieve organization ID using the access token
      axios
        .get("https://www.eventbriteapi.com/v3/users/me/organizations/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((orgResponse) => {
          // Assuming you want the first organization from the list
          const organizationId = orgResponse.data.organizations[0].id; // Get the first organization's ID
          console.log("Organization ID:", organizationId);

          // Redirect back to React app with access token and organization ID in query params
          return res.redirect(
            `http://localhost:3001?access_token=${accessToken}&organization_id=${organizationId}`
          );
        })
        .catch((orgError) => {
          console.error(
            "Error retrieving organization ID:",
            orgError.response ? orgError.response.data : orgError.message
          );
          return res.status(500).send("Error retrieving organization ID.");
        });
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      console.error("cURL Output:", stdout);
      return res.status(500).send("Error parsing access token response.");
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
