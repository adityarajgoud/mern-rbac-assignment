// backend/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const logActivity = require("../middleware/logger");

// Generate JWT token string helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register new user account
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Explicitly handle default assignments or allow admin initialization
    const user = await User.create({
      name,
      email,
      password,
      role: role || "User",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate User & Log Sign-In
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.status === "Inactive") {
        return res
          .status(403)
          .json({ message: "Your account is suspended. Contact Admin." });
      }

      // ====== ASSIGNMENT REQUIREMENT: LOG LOGIN ACTIVITY ======
      await logActivity(
        user._id,
        "LOGIN",
        `User ${user.email} successfully authenticated via web client.`,
      );

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials provided" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
