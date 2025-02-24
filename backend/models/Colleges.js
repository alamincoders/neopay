const mongoose = require("mongoose");

// Define the Event schema
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
});

// Define the Research schema
const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  publicationDate: { type: String, required: true },
  link: { type: String, required: true },
});

// Define the Review schema
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

// Define the College schema
const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    admissionDate: { type: String, required: true },
    admissionProcess: { type: String, required: true },
    events: [eventSchema], // Array of events
    researchHistory: [researchSchema], // Array of research papers
    sports: [String], // Array of sports
    rating: { type: Number, default: 0 }, // College rating
    reviews: [reviewSchema], // Array of reviews
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
