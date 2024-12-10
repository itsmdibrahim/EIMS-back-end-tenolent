const express = require("express");
const { courseAdd, courseGet } = require("../controller/course.js");

const router = express.Router();

// add course
router.post("/add", courseAdd);
// get course
router.get("/get", courseGet);

module.exports = router;
