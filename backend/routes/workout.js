const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

// 1. SAVE WORKOUT
router.post("/save", async (req, res) => {
  try {
    const { userId, exerciseName, reps, caloriesBurned } = req.body;

    const newWorkout = new Workout({
      userId: userId || "guest_user",
      exerciseName,
      reps,
      caloriesBurned,
    });

    await newWorkout.save();
    res.status(201).json({ message: "Workout saved successfully!" });
  } catch (err) {
    console.error("Save Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. GET HISTORY (For your Dashboard)
router.get("/history", async (req, res) => {
  try {
    const { userId } = req.query;
    const history = await Workout.find({ userId: userId || "guest_user" })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
