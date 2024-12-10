const express = require("express");
const {
  pendingCourseAdd,
  pendingCourseGet,
} = require("../controller/pendingCourse.js");

const router = express.Router();
// add course
router.post("/add", pendingCourseAdd);
// get pending course
router.post("/get", pendingCourseGet);

module.exports = router;
