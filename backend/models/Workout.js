const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "guest_user" },
    exerciseName: { type: String, required: true },
    reps: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model("Workout", WorkoutSchema);
