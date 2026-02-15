const mongoose = require("mongoose");

const DietLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    foods: [
      {
        name: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
      },
    ],
    totalCalories: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DietLog", DietLogSchema);
