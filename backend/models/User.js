const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // 1. Password is no longer required for Google-only users
  password: { type: String },

  // 2. Google-specific identifier
  googleId: { type: String, unique: true, sparse: true },

  // 3. Onboarding tracker
  isOnboardingComplete: { type: Boolean, default: false },

  age: Number,
  weight: Number,
  height: Number,
  fitnessGoal: {
    type: String,
    enum: ["Weight Loss", "Muscle Gain", "Maintenance"],
  },

  // --- TARGET FIELDS ---
  dailyCalorieTarget: {
    type: Number,
    default: 2000,
  },
  dailySquatTarget: {
    type: Number,
    default: 50,
  },
  dailyPushupTarget: {
    type: Number,
    default: 30,
  },
  dailyWaterTarget: {
    type: Number,
    default: 8,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
