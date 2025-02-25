const User = require("../models/User");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Register User or Agent
const registerUser = async (req, res) => {
  try {
    const { name, email, mobileNumber, pin, accountType, nid } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash PIN before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    const user = await User.create({
      name,
      email,
      mobileNumber,
      pin: hashedPin,
      accountType,
      nid,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User/Agent
const loginUser = async (req, res) => {
  try {
    const { email, pin } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(pin, user.pin))) {
      user.deviceToken = generateToken(user._id, "30d"); // Single device login
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        token: user.deviceToken,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id, "30d"),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, loginAdmin };
