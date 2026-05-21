// backend/controllers/taskController.js
const Task = require("../models/Task");
const logActivity = require("../middleware/logger");

// @desc    Create a task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await Task.create({ title, description, user: req.user._id });

    // Log mutation
    await logActivity(
      req.user._id,
      "TASK_CREATE",
      `Created task item: "${title}"`,
    );
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tasks (Filtered: Users get own, Admins get all)
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    // Admin permissions allow seeing everything, default users see isolated data
    const query = req.user.role === "Admin" ? {} : { user: req.user._id };
    const tasks = await Task.find(query).populate("user", "name email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.id || req.params.id);
    if (!task)
      return res.status(404).json({ message: "Task document not found" });

    // Restrict updates to owner only
    if (
      task.user.toString() !== req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized execution boundary" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;

    const updatedTask = await task.save();
    await logActivity(
      req.user._id,
      "TASK_UPDATE",
      `Modified task data for ID: ${task._id}`,
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task item
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: "Target task not found" });

    // User permissions vs Admin permissions check
    if (
      task.user.toString() !== req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ message: "Access denied: can only delete own records" });
    }

    await task.deleteOne();
    await logActivity(
      req.user._id,
      "TASK_DELETE",
      `Purged task identifier: ${req.params.id}`,
    );
    res.json({ message: "Task completely removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
