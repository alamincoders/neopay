const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user =
      (await User.findById(decoded.id).select("-pin")) ||
      (await Admin.findById(decoded.id).select("-password"));

    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

module.exports = { protect };
