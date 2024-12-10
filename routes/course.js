const express = require("express");
const {
  courseAdd,
  courseGet,
  courseOnePersonGet,
} = require("../controller/course.js");

const router = express.Router();

// add course
router.post("/add", courseAdd);
// get course
router.get("/get", courseGet);
// get course
router.get("/one-person/get/:userId", courseOnePersonGet);

module.exports = router;
