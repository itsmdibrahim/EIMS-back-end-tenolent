const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const fileUrlSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    userInfo: {
      type: mongoose.Schema.Types.ObjectId, // Reference to another model
      ref: "Auth", // Name of the model you're referencing
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    credits: {
      type: String,
      required: true,
    },
    filesUrl: [fileUrlSchema],
    scheduleInfo: [scheduleSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
