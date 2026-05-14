// // const jwt = require("jsonwebtoken");

// // const authMiddleware = (req, res, next) => {
// //   try {
// //     //  access token from cookie
// //     const token = req.cookies?.accessToken;

// //     if (!token) {
// //       return res.status(401).json({ message: "No access token" });
// //     }

// //     // verify access token
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     req.user = decoded; // id attach
// //     next();

// //   } catch (error) {
// //     return res.status(401).json({ message: "Invalid or expired token" });
// //   }
// // };

// // module.exports = authMiddleware;


// const jwt = require("jsonwebtoken");
// const User = require("../models/user.model");

// const authMiddleware = async (req, res, next) => {
//   try {
//     // access token from cookie
//     const token = req.cookies?.accessToken;

//     if (!token) {
//       return res.status(401).json({ message: "No access token" });
//     }

//     // verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 🔥 DB se user fetch
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user; // full user object
//     next();

//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = authMiddleware;


// 🟢 authMiddleware.js (Replace full file)
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    // 🟢 Read from Cookie OR from Authorization Header
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]; // Get token from "Bearer <token>"
    }

    if (!token) {
      return res.status(401).json({ message: "No access token found" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
