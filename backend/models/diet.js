const router = require("express").Router();
const DietLog = require("../models/DietLog");

// POST: Add food to daily log
router.post("/add", async (req, res) => {
  const { userId, date, food } = req.body;
  try {
    let log = await DietLog.findOne({ userId, date });

    if (!log) {
      log = new DietLog({
        userId,
        date,
        foods: [food],
        totalCalories: food.calories,
      });
    } else {
      log.foods.push(food);
      log.totalCalories += food.calories;
    }

    const savedLog = await log.save();
    res.status(200).json(savedLog);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
});

// GET: Get specific day's log
router.get("/:userId/:date", async (req, res) => {
  try {
    const log = await DietLog.findOne({
      userId: req.params.userId,
      date: req.params.date,
    });
    // Return empty log if none exists yet
    res.status(200).json(log || { foods: [], totalCalories: 0 });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
