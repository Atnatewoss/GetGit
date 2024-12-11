const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config({ path: "./.env" });

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.post("/validate-username", async (req, res) => {
    console.log("Received request to validate username:", req.body);

    const { username } = req.body;
    if (!username) {
        console.error("Username is missing");
        return res.status(400).json({ message: "Username is required" });
    }

    try {
        const url = `https://api.github.com/users/${username}`;
        const headers = { Authorization: `token ${process.env.GITHUB_TOKEN}` };

        console.log("Environment Variables Loaded:");
        console.log("GitHub Token:", process.env.GITHUB_TOKEN); // Debug line
        console.log("Sending request to GitHub API:", url);

        const response = await axios.get(url, { headers });

        console.log("GitHub API response received:", response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error occurred while fetching data from GitHub");
        console.error("Error details:", error.response ? error.response.data : error.message);

        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});

module.exports = app;