const { default: mongoose } = require("mongoose");
const PendingCourse = require("../models/PendingCourse");

function trimObjectValues(obj) {
  if (!obj || typeof obj !== "object") return obj;

  // Create a new object to avoid mutating the original
  const trimmedObj = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === "string") {
        // Trim the string value
        trimmedObj[key] = value.trim();
      } else if (typeof value === "object" && value !== null) {
        // Recursively trim nested objects/arrays
        trimmedObj[key] = trimObjectValues(value);
      } else {
        // Copy other types of values as-is
        trimmedObj[key] = value;
      }
    }
  }

  return trimmedObj;
}

const pendingCourseAdd = async (req, res) => {
  const trimedObj = trimObjectValues(req.body);
  trimedObj.userInfo = new mongoose.Types.ObjectId(trimedObj.userInfo);
  trimedObj.courseInfo = new mongoose.Types.ObjectId(trimedObj.courseInfo);

  try {
    const newCourse = new PendingCourse(trimedObj);
    const result = await newCourse.save();

    res.status(200).json({ data: result, message: "data was saved!" });
  } catch (err) {
    console.error(err, err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  pendingCourseAdd,
};
