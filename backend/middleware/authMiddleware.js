const jwt = require("jsonwebtoken");
const User = require("../models/User");

// --- LAYER 1: VERIFY ROUTE ACCESS TOKEN ---
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the raw token string from the header string
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify the token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user data from DB using the ID inside the token payload, omitting the password field
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user account status is set to Inactive
      if (req.user && req.user.status === "Inactive") {
        return res
          .status(403)
          .json({ message: "User account is inactive. Access denied." });
      }

      next(); // Pass control to the next function/middleware
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ message: "Not authorized, token validation failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, token missing" });
  }
};

// --- LAYER 2: ENFORCE ROLE-BASED ACCESS CONTROL (RBAC) ---
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if the user object exists and if their role matches the permitted access list
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        message: `Access denied. Role '${req.user?.role || "Guest"}' is unauthorized.`,
      });
    }
  };
};

module.exports = { protect, authorize };
