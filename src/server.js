const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve the index.html when accessing the root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
