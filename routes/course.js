const express = require("express");
const { courseAdd } = require("../controller/course.js");

const router = express.Router();

// Register route
router.post("/add", courseAdd);

module.exports = router;
