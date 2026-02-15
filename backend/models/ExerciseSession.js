const mongoose = require("mongoose");

const ExerciseSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exerciseType: { type: String, required: true }, // "push-up", "squat", "plank"
  repsCompleted: { type: Number, default: 0 },
  targetReps: { type: Number },
  formAccuracy: { type: Number }, // Percentage from MediaPipe logic
  caloriesBurned: { type: Number },
  duration: { type: Number }, // in seconds
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExerciseSession", ExerciseSessionSchema);
