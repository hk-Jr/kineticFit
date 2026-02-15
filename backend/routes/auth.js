const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // CHANGE: Use _id instead of id to match MongoDB and Frontend expectations
    res.status(200).json({
      token,
      user: { name: user.name, _id: user._id },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // CHANGE: Use _id instead of id here too
    res.status(200).json({
      token,
      user: { name: user.name, _id: user._id },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update User Goals
router.put("/update-goals/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// backend/routes/auth.js
router.put("/update-goals/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }, // Returns the updated document
    ).select("-password"); // Don't send the password back!

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
});

//for dashboard
router.get("/activity/:userId", async (req, res) => {
  try {
    // This finds unique dates from Workouts and Diet logs
    const workouts = await Workout.find({ userId: req.params.userId }, "date");
    const diets = await Diet.find({ userId: req.params.userId }, "date");

    // Merge and format for Heatmap: [{ date: '2026-02-14', count: 1 }]
    const allDates = [...workouts, ...diets].map((item) => item.date);
    const uniqueDates = [...new Set(allDates)];

    const activityFormatted = uniqueDates.map((date) => ({
      date: date,
      count: 1,
    }));

    res.status(200).json(activityFormatted);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
