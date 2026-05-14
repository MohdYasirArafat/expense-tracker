const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

//  Fix: Environment ke hisaab se options set karein
const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  maxAge,
  secure: process.env.NODE_ENV === "production", // Render pe true hoga
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-origin ke liye none zaroori hai
  path: "/",
});

// Token Generators (Dono ki life ko cookie life ke sath same rakhein)
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m", // Cookie maxAge ke sath match hona chahiye
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// 1. SIGNUP CONTROLLER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const hashedPasword = await bcrypt.hash(password, 10);
    const createdUser = new User({ name, email, password: hashedPasword });
    await createdUser.save();

    return res.status(201).json({
      message: "User created successfully!",
      user: {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
      },
    });
  } catch (error) {
    console.log("Register error", error);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
};

// 2. LOGIN CONTROLLER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in Database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies seamlessly
    res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000)); // 15 Mins
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(7 * 24 * 60 * 60 * 1000),
    ); // 7 Days

    return res.json({ message: "Login successful" });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Authentication refresh token missing" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid refresh token instance" });
    }

    // Synchronous verify use karein taaki control flow break na ho
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const newAccessToken = generateAccessToken(user);
      res.cookie(
        "accessToken",
        newAccessToken,
        getCookieOptions(15 * 60 * 1000),
      );

      return res.status(200).json({ message: "Access token silently renewed" });
    } catch (err) {
      // Agar token invalid ya expire ho chuka hai
      return res.status(403).json({ message: "Refresh token session expired" });
    }
  } catch (error) {
    console.log("Refresh error:", error);
    return res
      .status(500)
      .json({ message: "Internal renewal token collision error" });
  }
};

// 4. LOGOUT CONTROLLER
const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.clearCookie("accessToken", clearOptions);
    res.clearCookie("refreshToken", clearOptions);
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Logout error:", error);
    return res.status(500).json({ message: "Server logout failure execution" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
};
