const express = require("express");
// const { registerUser, loginUser, logoutUser } = require("../controllers/user.controller.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const { registerUser, loginUser, logoutUser, refreshAccessToken } = require("../controllers/user.controller.js");


const userRouter = express.Router();

// //user routes
// userRouter.post('/signup',registerUser);
// userRouter.post('/login',loginUser);
// // userRouter.get('/logout',logoutUser);
// // routes/user.route.js mein ise change karein:
// userRouter.post('/logout', logoutUser); // ✅ HTTP POST Method use karein


// Routes block update karein:

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/refresh", refreshAccessToken); // ✅ Linked smoothly with axios.post('/auth/refresh')


// NEW: protected route (LOGIN CHECK)
userRouter.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});



module.exports = userRouter;