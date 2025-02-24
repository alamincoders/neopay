const { default: mongoose } = require("mongoose");
const Review = require("../models/Review");

// Get reviews for a college
exports.getReviews = async (req, res) => {
  const { collegeId } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(collegeId)) {
    return res.status(400).json({ message: "Invalid college ID" });
  }

  try {
    const reviews = await Review.find({ collegeId }).populate("userId", "name");
    res.status(200).json({
      message: "Reviews fetched",
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  const newReview = new Review(req.body);
  try {
    await newReview.save();
    res.status(201).json({ message: "Review created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Review updated", data: updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};
