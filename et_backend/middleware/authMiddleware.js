const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    // access token from cookie
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No access token" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 DB se user fetch
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // full user object
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;

