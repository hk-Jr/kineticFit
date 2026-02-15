const router = require("express").Router();
const DietLog = require("../models/DietLog");

// 1. POST: Add food to daily log
router.post("/add", async (req, res) => {
  const { userId, date, food } = req.body;
  try {
    let log = await DietLog.findOne({ userId, date });

    if (!log) {
      // Create new log if first entry of the day
      log = new DietLog({
        userId,
        date,
        foods: [food],
        totalCalories: food.calories,
      });
    } else {
      // Update existing log
      log.foods.push(food);
      log.totalCalories += food.calories;
    }

    const savedLog = await log.save();
    res.status(200).json(savedLog);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET: Get specific day's log
router.get("/:userId/:date", async (req, res) => {
  try {
    const log = await DietLog.findOne({
      userId: req.params.userId,
      date: req.params.date,
    });
    res.status(200).json(log || { foods: [], totalCalories: 0 });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE: Remove a food item from the log by index
router.delete("/remove/:userId/:date/:index", async (req, res) => {
  try {
    const { userId, date, index } = req.params;
    let log = await DietLog.findOne({ userId, date });

    if (log) {
      // Subtract the calories of the item being removed
      const removedFood = log.foods[index];
      log.totalCalories -= removedFood.calories;

      // Remove from array
      log.foods.splice(index, 1);

      await log.save();
      res.status(200).json(log);
    } else {
      res.status(404).json("Log not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
