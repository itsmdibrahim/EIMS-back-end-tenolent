const express = require("express");
const {
  courseAdd,
  courseGet,
  courseOnePersonGet,
  courseDelete,
} = require("../controller/course.js");

const router = express.Router();

// add course
router.post("/add", courseAdd);
// get course
router.get("/get", courseGet);
// get one-person course
router.get("/one-person/get/:userId", courseOnePersonGet);
//delete course
router.delete("/delete/:id", courseDelete);

module.exports = router;
