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

// Admin Register
const registerAdmin = async (req, res) => {
  try {
    const { name, email, mobileNumber, pin, role } = req.body;

    // Check if admin already exists (by email or mobile number)
    const adminExists = await Admin.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the PIN before saving
        const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    // Create a new admin
    const admin = await Admin.create({
      name,
      email,
      mobileNumber,
      pin, // Store the hashed PIN
      role,
      isLoggedIn: false, // Track login session
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mobileNumber: admin.mobileNumber,
        role: admin.role,
        token: generateToken(admin._id, "30d"),
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, mobileNumber, pin } = req.body;

    // Find admin by email or mobile number
    const admin = await Admin.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(pin !== admin.pin, pin, admin.pin);
    if (pin !== admin.pin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Ensure admin is logging in from one device only
    if (admin.isLoggedIn) {
      return res
        .status(403)
        .json({ message: "Already logged in from another device" });
    }

    // Update isLoggedIn status
    admin.isLoggedIn = true;
    await admin.save();

    res.cookie("token", admin.token, { httpOnly: true, secure: true });
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      mobileNumber: admin.mobileNumber,
      role: admin.role,
      token: generateToken(admin._id, "30d"),
    });
  } catch (error) {
    console.error("Server error:", error); // Log any server errors
    res.status(500).json({ message: "Server error" });
  }
};

// user logout
const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Clear device token
    user.deviceToken = null;
    await user.save();

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.isLoggedIn = false;
    await admin.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
  logoutUser,
  logoutAdmin,
};
