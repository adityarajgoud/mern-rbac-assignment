const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getActivityLogs,
  getSystemAnalytics,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Enforce global Admin-Only restrictions across this entire router file
router.use(protect, authorize("Admin"));

// User Records Admin Routing Boundaries
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/status", updateUserStatus);

// System Monitoring Logs and Analytics Endpoints
router.get("/logs", getActivityLogs);
router.get("/analytics", getSystemAnalytics);

module.exports = router;
