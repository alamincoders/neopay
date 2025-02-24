const College = require("../models/Colleges");

exports.getColleges = async (req, res) => {
  const colleges = await College.find();
  res.json({ message: "Colleges fetched", data: colleges });
};

exports.getSingleCollege = async (req, res) => {
  const college = await College.findById(req.params.id);
  if (!college) return res.status(404).json({ error: "College not found" });
  res.json({ message: "College details fetched", data: college });
};

// Create a new college
exports.createCollege = async (req, res) => {
  const newCollege = new College(req.body);
  try {
    const savedCollege = await newCollege.save();
    res.status(201).json({ message: "College created", data: savedCollege });
  } catch (error) {
    res.status(500).json({ message: "Error creating college", error });
  }
};

// Update a college
exports.updateCollege = async (req, res) => {
  try {
    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "College updated", data: updatedCollege });
  } catch (error) {
    res.status(500).json({ message: "Error updating college", error });
  }
};

// Delete a college
exports.deleteCollege = async (req, res) => {
  try {
    await College.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "College deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting college", error });
  }
};
