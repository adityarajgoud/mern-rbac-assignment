const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ["LOGIN", "TASK_CREATE", "TASK_UPDATE", "TASK_DELETE"],
  },
  details: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
