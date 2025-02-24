const express = require("express");
const {
  getColleges,
  getMyCollege,
  createCollege,
  createMyCollege,
  updateCollege,
  deleteCollege,
  getSingleCollege,
} = require("../controllers/college.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

// College routes
router.get("/", getColleges);
router.get("/:id", getSingleCollege);
router.post("/", protect, createCollege);
router.put("/:id", protect, updateCollege);
router.delete("/:id", protect, deleteCollege);

module.exports = router;
