const express = require("express");
const {
  registerUser,
  loginUser,
  loginAdmin,
  registerAdmin,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

// Example of using protect middleware to secure routes
router.get("/profile", protect, (req, res) => {
  res.json({ message: "This is a protected route" });
});

module.exports = router;
