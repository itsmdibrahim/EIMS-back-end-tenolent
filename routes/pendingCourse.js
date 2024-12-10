const express = require("express");
const { pendingCourseAdd } = require("../controller/pendingCourse.js");

const router = express.Router();
// add course
router.post("/add", pendingCourseAdd);

module.exports = router;
