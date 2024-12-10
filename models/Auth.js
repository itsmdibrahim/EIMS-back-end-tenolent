const mongoose = require("mongoose");

// User Schema
const activitiesSchema = new mongoose.Schema(
  {
    courseInfo: {
      type: mongoose.Schema.Types.ObjectId, // Reference to another model
      ref: "Course", // Name of the model you're referencing
      required: true,
    },
    grades: {
      type: String,
    },
    attendance: {
      type: Boolean,
      default: false,
    },
    enrolled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const coursesSchema = new mongoose.Schema(
  {
    courseInfo: {
      type: mongoose.Schema.Types.ObjectId, // Reference to another model
      ref: "Course", // Name of the model you're referencing
      required: true,
    },
  },
  { timestamps: true }
);

const authSchema = new mongoose.Schema(
  {
    userType: { type: String, default: "student" },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
    },
    address: {
      type: String,
    },
    activities: [activitiesSchema],
    courses: [coursesSchema],
    resetCode: {
      type: String,
    },
  },
  { timestamps: true }
);

// User Model
const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
