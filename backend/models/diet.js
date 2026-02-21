const mongoose = require("mongoose");

const DietLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  foods: [
    {
      name: { type: String, required: true },
      calories: { type: Number, required: true },
      protein: { type: Number },
      carbs: { type: Number },
      fats: { type: Number },
    },
  ],
  totalCalories: { type: Number, default: 0 },
});

module.exports = mongoose.model("DietLog", DietLogSchema);
