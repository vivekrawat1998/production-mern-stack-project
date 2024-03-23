const jwt = require("jsonwebtoken");
const User = require("../models/usermodal");

exports.requireSignin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("Received token:", token);
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization token is missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ success: false, message: "Invalid token" });
        } else if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, message: "Token expired" });
        } else {
          return res.status(500).json({ success: false, message: "Internal server error" });
        }
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in admin middleware",
      error: error.message,
    });
  }
};
