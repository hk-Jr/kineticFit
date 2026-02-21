const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize App
const app = express();

// 3. Import Routes
const authRoute = require("./routes/auth");
const dietRoute = require("./routes/diet");
const workoutRoute = require("./routes/workout"); // Ensure this file exists in /routes

// 4. Middleware
app.use(cors());
app.use(express.json()); // Critical for parsing the 'food' object in diet logs

// 5. Register Routes
// authRoute now handles /login, /signup, /activity heatmap, and /log-activity
app.use("/api/auth", authRoute);

// dietRoute handles /add, /remove, and fetching daily logs
app.use("/api/diet", dietRoute);

// workoutRoute handles saving exercise sessions
app.use("/api/workout", workoutRoute);

// 6. MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 KineticFit Database Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
