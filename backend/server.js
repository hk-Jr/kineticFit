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
// const exerciseRoute = require("./routes/exercise"); // Future use

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. Register Routes
app.use("/api/auth", authRoute);
app.use("/api/diet", dietRoute);

app.use("/api/workout", require("./routes/workout"));
// 6. MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 KineticFit Database Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
