console.log("NEW SERVER FILE RUNNING");

const express = require("express");
const redis = require("./cache/redisClient");
const emailQueue = require("./jobs/emailQueue");

const app = express();

app.use(express.json());

// Redis Connection Check
redis.on("connect", () => {
  console.log("Redis Connected");
});

// Home Route
app.get("/", (req, res) => {
  res.send("Server Running Successfully");
});

// Users Route with Redis Cache
app.get("/users", async (req, res) => {
  try {
    const cachedData = await redis.get("users");

    if (cachedData) {
      return res.json({
        source: "cache",
        data: JSON.parse(cachedData),
      });
    }

    const users = [
      { id: 1, name: "John" },
      { id: 2, name: "Alice" },
    ];

    await redis.set("users", JSON.stringify(users), "EX", 30);

    res.json({
      source: "database",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send Email Route
app.get("/send-email", async (req, res) => {
  try {
    await emailQueue.add("sendEmailJob", {
      email: "test@gmail.com",
    });

    res.json({
      message: "Email job added to queue",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hello Route
app.get("/hello", (req, res) => {
  res.send("HELLO ROUTE WORKING");
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});