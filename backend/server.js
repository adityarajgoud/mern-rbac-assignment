const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

// Import Route Blueprint Files
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Load configurations
dotenv.config();

// Initialize Database connection instance
connectDB();

const app = express();

// Apply Global App Middlewares
// Explicit CORS configuration targeting your production frontend and local dev servers
app.use(
  cors({
    origin: ["https://mern-rbac-frontend.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Bind Application REST Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

// Main API Base Health Check
app.get("/", (req, res) => {
  res.send("MERN RBAC Engine API running successfully...");
});

// Global Fallback Error Handler catching undefined payload errors
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing safely on port ${PORT}`);
});

// ====== CRITICAL VERCEL DEPLOYMENT EXPORT ======
// Required so Vercel can parse this file as a serverless execution module
module.exports = app;
