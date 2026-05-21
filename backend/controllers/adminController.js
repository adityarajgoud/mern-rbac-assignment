// backend/controllers/adminController.js
const User = require("../models/User");
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");

// @desc    Get complete collection of users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update active state of a user account
// @route   PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();
    res.json({ message: `User account status shifted to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete system user account completely
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User object not found" });

    // ====== SAFETY RULE: BOOT IF ADMIN TRIES TO DELETE THEMSELVES ======
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message:
          "Security Violation: You cannot delete your own administrative account while logged in.",
      });
    }

    await user.deleteOne();
    res.json({ message: "User record completely removed from node cluster" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch whole activity audit log array
// @route   GET /api/admin/logs
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({})
      .populate("user", "name email role")
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch metric aggregations for frontend dashboards
// @route   GET /api/admin/analytics
const getSystemAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalTasks = await Task.countDocuments({});
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const pendingTasks = await Task.countDocuments({ status: "Pending" });

    res.json({ totalUsers, totalTasks, completedTasks, pendingTasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getActivityLogs,
  getSystemAnalytics,
};
