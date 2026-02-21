const router = require("express").Router();
const User = require("../models/User");
const Activity = require("../models/Activity");
const Workout = require("../models/Workout");
const DietLog = require("../models/DietLog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP: Create new user
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dailyCalorieTarget: 2500, // Default target for new users
    });

    const savedUser = await newUser.save();

    // 4. Log initial activity so heatmap shows their signup day
    const today = new Date().toISOString().split("T")[0];
    const initialActivity = new Activity({
      userId: savedUser._id,
      date: today,
      count: 1,
    });
    await initialActivity.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err });
  }
});

// LOGIN: Verify and generate token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Compare Password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    // 3. Generate JWT Token
    const token = jwt.sign({ id: user._id }, "YOUR_SECRET_KEY", {
      expiresIn: "1d",
    });

    // 4. Remove password from response for security
    const { password: _, ...userData } = user._doc;
    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
});

// DASHBOARD HEATMAP: Consolidates activity from all sources
router.get("/activity/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const workouts = await Workout.find({ userId }, "date");
    const diets = await DietLog.find({ userId }, "date"); // Using diet.js model
    const logins = await Activity.find({ userId }, "date");

    const allDates = [
      ...workouts.map((d) => d.date),
      ...diets.map((d) => d.date),
      ...logins.map((d) => d.date),
    ];

    const uniqueDates = [...new Set(allDates)];
    const activityFormatted = uniqueDates.map((date) => ({ date, count: 1 }));
    res.status(200).json(activityFormatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching heatmap", error: err });
  }
});

// LOG DAILY VISIT: Marks today as "Active"
router.post("/log-activity/:userId", async (req, res) => {
  const { userId } = req.params;
  const today = new Date().toISOString().split("T")[0];
  try {
    let activity = await Activity.findOne({ userId, date: today });
    if (!activity) {
      activity = new Activity({ userId, date: today, count: 1 });
      await activity.save();
    }
    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
