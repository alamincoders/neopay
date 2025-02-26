const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pin: {
      type: String, // Hashed PIN for security
      required: true,
      minlength: 5,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{11}$/, // Example: Validates 11-digit phone numbers
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email validation
    },
    accountType: {
      type: String,
      enum: ["User", "Agent"],
      required: true,
    },
    nid: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: function () {
        return this.accountType === "User" ? 40 : 100000;
      },
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    deviceToken: {
      type: String, // To ensure users log in from only one device at a time
      default: null,
    },
    agentIncome: {
      type: Number,
      default: 0,
    }, // Only for Agents
  },
  { timestamps: true }
);

// Hash PIN before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) return next();
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
  next();
});

// Method to compare PIN
userSchema.methods.comparePin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
