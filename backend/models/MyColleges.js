const mongoose = require("mongoose");

const myCollegeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Adjusted to store Firebase user ID as a string
    collegeId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    statement: {
      type: String,
      trim: true,
    },
    /*     image: {
      type: String,
      required: true,
    }, */
  },
  { timestamps: true }
);

module.exports = mongoose.model("MyCollege", myCollegeSchema);
