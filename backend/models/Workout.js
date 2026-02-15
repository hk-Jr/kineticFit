const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ["squat", "pushup"], required: true },
    reps: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Workout", WorkoutSchema);
