const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  weight: Number,
  height: Number,
  fitnessGoal: {
    type: String,
    enum: ["Weight Loss", "Muscle Gain", "Maintenance"],
  },
  // --- NEW TARGET FIELDS ---
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
    default: 8, // glasses or liters, depending on your UI
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
