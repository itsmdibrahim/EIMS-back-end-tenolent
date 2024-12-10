const mongoose = require("mongoose");

const pendingCourseSchema = new mongoose.Schema(
  {
    userInfo: {
      type: mongoose.Schema.Types.ObjectId, // Reference to another model
      ref: "Auth", // Name of the model you're referencing
      required: true,
    },
    courseInfo: {
      type: mongoose.Schema.Types.ObjectId, // Reference to another model
      ref: "Course", // Name of the model you're referencing
      required: true,
    },
    pendingStatus: {
      type: String,
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const PendingCourse = mongoose.model("PendingCourse", pendingCourseSchema);

module.exports = PendingCourse;
