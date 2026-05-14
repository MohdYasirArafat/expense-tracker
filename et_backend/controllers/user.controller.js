// // const jwt = require("jsonwebtoken");
// // const User = require("../models/user.model.js");
// // const bcrypt = require("bcryptjs");

// // //signup
// // const registerUser = async (req, res) => {
// //   const { name, email, password } = req.body;

// //   try {
// //     const userExists = await User.findOne({ email });
// //     if (userExists) {
// //       // Added 'return' so the function stops here if user exists
// //       return res.status(400).json({ message: "user already exist !" });
// //     }
// //     const hashedPasword = await bcrypt.hash(password, 10);

// //     const createdUser = new User({
// //       name,
// //       email,
// //       password: hashedPasword,
// //     });

// //     // createdUser.role="admin";

// //     await createdUser.save();

// //     const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
// //       expiresIn: "1d",
// //     });

// //     // 3. Send back ONE object containing all the data
// //     res.status(201).json({
// //       message: "user created successfully!",
// //       user: {
// //         _id: createdUser._id,
// //         name: createdUser.name,
// //         email: createdUser.email,
// //       },
// //       token,
// //     });
// //   } catch (error) {
// //     console.log("register error", error);
// //   }
// // };

// // //  Generate Tokens
// // const generateAccessToken = (user) => {
// //   return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
// //     expiresIn: "15m",
// //   });
// // };

// // const generateRefreshToken = (user) => {
// //   return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
// //     expiresIn: "7d",
// //   });
// // };

// // // LOGIN CONTROLLER

// // const loginUser = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(400).json({ message: "User not found" });

// //     const match = await bcrypt.compare(password, user.password);
// //     if (!match) return res.status(400).json({ message: "Wrong password" });

// //     const accessToken = generateAccessToken(user);
// //     const refreshToken = generateRefreshToken(user);

// //     // save refresh token in DB
// //     user.refreshToken = refreshToken;
// //     await user.save();

// //     // ACCESS TOKEN COOKIE
// //     res.cookie("accessToken", accessToken, {
// //       httpOnly: true,
// //       secure: false,
// //       sameSite: "lax",
// //     });

// //     // REFRESH TOKEN COOKIE
// //     res.cookie("refreshToken", refreshToken, {
// //       httpOnly: true,
// //       secure: false,
// //       sameSite: "lax",
// //     });

// //     res.json({ message: "Login successful" });
// //   } catch (error) {
// //     console.log("login error:", error);
// //   }
// // };

// // //logout
// // const logoutUser = async (req, res) => {
// //   try {
// //     const refreshToken = req.cookies?.refreshToken;

// //     if (refreshToken) {
// //       const user = await User.findOne({ refreshToken });

// //       if (user) {
// //         user.refreshToken = null;
// //         await user.save();
// //       }
// //     }

// //     // clear cookies
// //     res.clearCookie("accessToken");
// //     res.clearCookie("refreshToken");

// //     res.json({ message: "Logged out successfully" });
// //   } catch (error) {
// //     console.log(error);
// //   }
// // };

// // module.exports = {
// //   registerUser,
// //   loginUser,
// //   logoutUser,
// // };





// const jwt = require("jsonwebtoken");
// const User = require("../models/user.model.js");
// const bcrypt = require("bcryptjs");

// // 🔑 Common Cookie Options for Dev and Production
// const getCookieOptions = (customMaxAge) => ({
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production", // Prod me automatic true hoga
//   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-domain ke liye prod me 'none'
//   maxAge: customMaxAge,
// });

// // 🔑 Token Generators (Dono ki life ko cookie life ke sath same rakhein)
// const generateAccessToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
//     expiresIn: "15m" // 🟢 Cookie maxAge ke sath match hona chahiye
//   });
// };

// const generateRefreshToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { 
//     expiresIn: "7d" 
//   });
// };

// // 1. SIGNUP CONTROLLER
// const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists!" });
//     }
//     const hashedPasword = await bcrypt.hash(password, 10);
//     const createdUser = new User({ name, email, password: hashedPasword });
//     await createdUser.save();
    
//     return res.status(201).json({ 
//       message: "User created successfully!", 
//       user: { _id: createdUser._id, name: createdUser.name, email: createdUser.email },
//     });
//   } catch (error) {
//     console.log("Register error", error);
//     return res.status(500).json({ message: "Server error during registration" });
//   }
// };

// // 2. LOGIN CONTROLLER
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Wrong password" });

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     // Save refresh token in Database
//     user.refreshToken = refreshToken;
//     await user.save();

//     // Set cookies seamlessly
//     res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000)); // 15 Mins
//     res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 Days

//     return res.json({ message: "Login successful" });
//   } catch (error) {
//     console.log("Login error:", error);
//     return res.status(500).json({ message: "Server error during login" });
//   }
// };

// // 3. ✅ SILENT REFRESH CONTROLLER (FIXED)
// // const refreshAccessToken = async (req, res) => {
// //   try {
// //     const refreshToken = req.cookies?.refreshToken;
// //     if (!refreshToken) {
// //       return res.status(401).json({ message: "Authentication refresh token missing" });
// //     }

// //     // Database check
// //     const user = await User.findOne({ refreshToken });
// //     if (!user) {
// //       return res.status(403).json({ message: "Invalid refresh token instance" });
// //     }

// //     // JWT verification
// //     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
// //       if (err) {
// //         return res.status(403).json({ message: "Refresh token session expired" });
// //       }

// //       // Fresh 15-minute token generate karein
// //       const newAccessToken = generateAccessToken(user);

// //       // 🟢 FIX: Dynamic Cookie Options load kiye jo production me chalenge
// //       res.cookie("accessToken", newAccessToken, getCookieOptions(15 * 60 * 1000)); 

// //       // 🟢 FIX: Return ko callback ke andar daala taaki response sahi time par jaye
// //       return res.status(200).json({ message: "Access token silently renewed" });
// //     });
// //   } catch (error) {
// //     console.log("Refresh error:", error);
// //     return res.status(500).json({ message: "Internal renewal token collision error" });
// //   }
// // };

// const refreshAccessToken = async (req, res) => {
//   try {
//     const refreshToken = req.cookies?.refreshToken;
//     if (!refreshToken) {
//       return res.status(401).json({ message: "Authentication refresh token missing" });
//     }

//     const user = await User.findOne({ refreshToken });
//     if (!user) {
//       return res.status(403).json({ message: "Invalid refresh token instance" });
//     }

//     // Synchronous verify use karein taaki control flow break na ho
//     try {
//       jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
//       const newAccessToken = generateAccessToken(user);
//       res.cookie("accessToken", newAccessToken, getCookieOptions(15 * 60 * 1000));
      
//       return res.status(200).json({ message: "Access token silently renewed" });
//     } catch (err) {
//       // Agar token invalid ya expire ho chuka hai
//       return res.status(403).json({ message: "Refresh token session expired" });
//     }

//   } catch (error) {
//     console.log("Refresh error:", error);
//     return res.status(500).json({ message: "Internal renewal token collision error" });
//   }
// };

// // 4. LOGOUT CONTROLLER
// const logoutUser = async (req, res) => {
//   try {
//     const refreshToken = req.cookies?.refreshToken;
//     if (refreshToken) {
//       const user = await User.findOne({ refreshToken });
//       if (user) {
//         user.refreshToken = null;
//         await user.save();
//       }
//     }

//     const clearOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     };

//     res.clearCookie("accessToken", clearOptions);
//     res.clearCookie("refreshToken", clearOptions);
//     return res.json({ message: "Logged out successfully" });
//   } catch (error) {
//     console.log("Logout error:", error);
//     return res.status(500).json({ message: "Server logout failure execution" });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   logoutUser,
//   refreshAccessToken
// };


const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

// 🔑 Common Cookie Options for Dev and Production
const getCookieOptions = (customMaxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Prod me automatic true hoga
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-domain ke liye prod me 'none'
  maxAge: customMaxAge,
});

// 🔑 Token Generators (Dono ki life ko cookie life ke sath same rakhein)
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m" // 🟢 Cookie maxAge ke sath match hona chahiye
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d"
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
      user: { _id: createdUser._id, name: createdUser.name, email: createdUser.email },
    });
  } catch (error) {
    console.log("Register error", error);
    return res.status(500).json({ message: "Server error during registration" });
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
    res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 Days
    return res.json({ message: "Login successful" });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// 3. ✅ SILENT REFRESH CONTROLLER (FULLY SECURED)
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Authentication refresh token missing" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token instance" });
    }

    // Synchronous verify use karein taaki control flow break na ho
    try {
      // 🟢 FIX: Decoded object extract karein taaki exact dynamic data verify ho ske
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Target correct verified instance parameters
      const newAccessToken = generateAccessToken({ _id: decoded.id });
      
      res.cookie("accessToken", newAccessToken, getCookieOptions(15 * 60 * 1000));
      return res.status(200).json({ message: "Access token silently renewed" });
    } catch (err) {
      // Agar token invalid ya expire ho chuka hai
      return res.status(403).json({ message: "Refresh token session expired" });
    }
  } catch (error) {
    console.log("Refresh error:", error);
    return res.status(500).json({ message: "Internal renewal token collision error" });
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

module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken };
