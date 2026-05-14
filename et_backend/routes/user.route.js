const express = require("express");
// const { registerUser, loginUser, logoutUser } = require("../controllers/user.controller.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const { registerUser, loginUser, logoutUser, refreshAccessToken } = require("../controllers/user.controller.js");


const userRouter = express.Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/refresh", refreshAccessToken); //  Linked smoothly with axios.post('/auth/refresh')


// NEW: protected route (LOGIN CHECK)
userRouter.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});



module.exports = userRouter;