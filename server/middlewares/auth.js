const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// =======================
// Auth Middleware
// =======================
exports.auth = async (req, res, next) => {
  try {
    // 1. Extract token from cookies, body, or header
    let token = req.cookies?.token || req.body?.token;

    if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "").trim();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    // 3. Optional: check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    // 4. Attach essential info to req.user
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenantId, // IMPORTANT: needed for multi-tenant checks
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// =======================
// Role Check Middleware
// =======================
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

exports.isMember = (req, res, next) => {
  try {
    if (req.user.role !== "Member") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for Member only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

// =======================
// Generic Role Checker
// =======================
exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Role ${req.user.role} is not allowed to access this route`,
    });
  }
  next();
};

