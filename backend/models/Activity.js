const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
  },
  { timestamps: true },
);

// Ensure a user only gets one "activity" record per day
ActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Activity", ActivitySchema);
