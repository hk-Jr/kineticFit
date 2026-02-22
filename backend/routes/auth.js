const router = require("express").Router();
const User = require("../models/User");
const Activity = require("../models/Activity");
const Workout = require("../models/Workout");
const DietLog = require("../models/DietLog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// 1. New Import
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE AUTH: New Route
router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new Google User
      user = new User({
        name,
        email,
        googleId,
        isOnboardingComplete: false, // Flag to collect height/weight later
        dailyCalorieTarget: 2500,
      });
      await user.save();

      // Log initial activity
      const today = new Date().toISOString().split("T")[0];
      await new Activity({ userId: user._id, date: today, count: 1 }).save();
    } else if (!user.googleId) {
      // Link Google to existing email/pass account
      user.googleId = googleId;
      await user.save();
    }

    // Generate JWT
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token: appToken,
      user: { ...user._doc, password: null },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(400).json({ message: "Google Authentication failed" });
  }
});

// SIGNUP: (Existing - Unchanged)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dailyCalorieTarget: 2500,
    });

    const savedUser = await newUser.save();
    const today = new Date().toISOString().split("T")[0];
    await new Activity({ userId: savedUser._id, date: today, count: 1 }).save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err });
  }
});

// LOGIN: (Existing - Updated to use process.env)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: _, ...userData } = user._doc;
    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
});

// DASHBOARD HEATMAP: (Existing - Unchanged)
router.get("/activity/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const workouts = await Workout.find({ userId }, "date");
    const diets = await DietLog.find({ userId }, "date");
    const logins = await Activity.find({ userId }, "date");

    const allDates = [
      ...workouts.map((d) => d.date),
      ...diets.map((d) => d.date),
      ...logins.map((d) => d.date),
    ];

    const uniqueDates = [...new Set(allDates)];
    res.status(200).json(uniqueDates.map((date) => ({ date, count: 1 })));
  } catch (err) {
    res.status(500).json({ message: "Error fetching heatmap", error: err });
  }
});

// LOG DAILY VISIT: (Existing - Unchanged)
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

// routes/auth.js

// UPDATE PROFILE: For Google users finishing onboarding
router.put("/update-profile/:userId", async (req, res) => {
  try {
    const { age, weight, height, fitnessGoal, isOnboardingComplete } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        age,
        weight,
        height,
        fitnessGoal,
        isOnboardingComplete,
      },
      { new: true }, // returns the updated document
    );

    res.status(200).json({
      message: "Profile updated!",
      user: { ...updatedUser._doc, password: null },
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
});

module.exports = router;
