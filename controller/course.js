const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");

function capitalizeFirstLetter(input) {
  if (typeof input !== "string" || input.length === 0) {
    return input; // Return as is for non-string or empty values
  }

  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
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
// Convert nested ObjectId strings in req.body
function convertObjectId(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "string" && mongoose.isValidObjectId(obj[key])) {
      obj[key] = new mongoose.Types.ObjectId(obj[key]);
    } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      convertObjectId(obj[key]); // Recursively handle nested objects
    }
  }
}

const courseAdd = async (req, res) => {
  const trimedObj = trimObjectValues(req.body);
  const convObj = convertObjectId(trimedObj);

  try {
    const newCourse = new Course(trimedObj);
    const result = await newCourse.save();

    res.status(200).json({ data: result, message: "data was saved!" });
  } catch (err) {
    console.error(err, err.message);
    res.status(500).json({ message: err.message });
  }
};
const courseGet = async (req, res) => {
  try {
    const result = await Course.find();

    res.status(200).json({ data: result, message: "data was saved!" });
  } catch (err) {
    console.error(err, err.message);
    res.status(500).json({ message: err.message });
  }
};
const courseOnePersonGet = async (req, res) => {
  let { userId } = req.params;

  console.log(userId);

  try {
    const result = await Course.find({
      userInfo: new mongoose.Types.ObjectId(userId),
    });

    res.status(200).json({ data: result, message: "data was saved!" });
  } catch (err) {
    console.error(err, err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  courseAdd,
  courseGet,
  courseOnePersonGet,
};
