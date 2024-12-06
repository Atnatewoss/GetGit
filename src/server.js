const express = require("express");
const cors = require("cors");
const axios = require("axios");
const redis = require("redis");
require("dotenv").config();

const app = express();
const PORT = 3000;

// // Redis Client Setup
// const redisClient = redis.createClient();
// redisClient.on("error", (err) => console.error("Redis error:", err));

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

// // Rate Limiter Middleware
// const RATE_LIMIT_WINDOW = 3600; // 60 seconds
// const MAX_REQUESTS = 5000; // 100 requests per window per user

// const rateLimiter = async (req, res, next) => {
//     const ip = req.ip; // Use IP address for rate-limiting
//     const key = `rate:${ip}`;
//     const now = Math.floor(Date.now() / 1000); // Current time in seconds

//     try {
//         const requests = await redisClient.get(key);

//         if (!requests) {
//             // First request: initialize the counter with expiry
//             await redisClient.set(key, 1, "EX", RATE_LIMIT_WINDOW);
//             return next();
//         }

//         if (parseInt(requests) < MAX_REQUESTS) {
//             // Increment counter for subsequent requests
//             await redisClient.incr(key);
//             return next();
//         }

//         // Exceeded rate limit
//         res.set("Retry-After", RATE_LIMIT_WINDOW);
//         return res.status(429).json({ message: "Too many requests. Please try again later." });
//     } catch (err) {
//         console.error("Rate limiter error:", err);
//         return res.status(500).json({ message: "Internal server error." });
//     }
// };

// Apply rate limiter middleware to specific routes
//Apply the rate limiter aswell
app.post("/validate-username", async (req, res) => {
    console.log('Received request to validate username:', req.body);

    const { username } = req.body;
    if (!username) {
        console.error("Username is missing");
        return res.status(400).json({ message: "Username is required" });
    }

    try {
        const url = `https://api.github.com/users/${username}`;
        const headers = { Authorization: `token ${process.env.GITHUB_TOKEN}` };    

        console.log('GitHub Token:', process.env.GITHUB_TOKEN);

        console.log('Sending request to GitHub API:', url);
        const response = await axios.get(url, { headers });

        console.log('GitHub API response received:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error occurred while fetching data from GitHub");

        // GitHub API error - user not found
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: "User not found" });
        }

        // General API error (e.g., rate limit exceeded, etc.)
        return res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})