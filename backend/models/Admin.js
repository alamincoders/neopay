const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{11}$/, // Example: Validates 11-digit phone numbers
    },

    role: {
      type: String,
      enum: ["Admin", "SuperAdmin"],
      required: true,
    },
    totalSystemMoney: {
      type: Number,
      default: 0,
    },
    adminIncome: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
