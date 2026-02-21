const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    exerciseName: { type: String, required: true }, // Changed from 'type'
    reps: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Workout", WorkoutSchema);
