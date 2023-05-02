const express = require("express");
const userRouter = express.Router();
const { signup, login, logout } = require("../controllers/user.controller");
const { auth } = require("../middleware/auth.middlewarr");

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/logout", auth, logout);

module.exports = { userRouter };
