const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

// Every single route in this file requires a valid JWT token
router.route("/").post(protect, createTask).get(protect, getTasks);

router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
