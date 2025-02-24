const MyCollege = require("../models/MyColleges.js");

exports.getMyCollege = async (req, res) => {
  const colleges = await MyCollege.find();
  res.json({ message: "Colleges fetched", data: colleges });
};
// Create a new college
exports.createMyCollege = async (req, res) => {
  const myCollege = new MyCollege(req.body);

  try {
    const savedCollege = await myCollege.save();
    res.status(201).json({ message: "College created", data: savedCollege });
  } catch (error) {
    res.status(500).json({ message: "Error creating college", error });
  }
};
