const router = require("express").Router();
const Workout = require("../models/Workout");

// Save Workout
router.post("/save", async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    const saved = await newWorkout.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Today's Workouts
router.get("/today/:userId/:date", async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.params.userId,
      date: req.params.date,
    });
    res.status(200).json(workouts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
