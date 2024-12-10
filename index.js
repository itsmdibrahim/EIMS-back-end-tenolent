const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Enable All CORS Requests
const corsOptions = {
  origin: [process.env.FRONT_END_URL, process.env.FRONT_END_MOBILE_URL],
  methods: "GET,POST,PUT,DELETE",
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.DB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course.js");
const { auth } = require("./middleware/auth");
// Apply middleware globally

app.use("/api/auth", authRoutes);
app.use("/api/course", auth, courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("listening..");
});
