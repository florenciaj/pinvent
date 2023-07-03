const express = require("express");
const { registerUser, loginUser, logoutUser, getUser, loginStatus, updateUser, changePasswordUser, forgotPasswordUser, resetPasswordUser } = require("../Service/UserService");
const protectSession = require("../Middleware/AuthMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/logged-in", loginStatus);
router.get("/user", protectSession, getUser);
router.patch("/user", protectSession, updateUser);
router.patch("/change-password", protectSession, changePasswordUser);
router.post("/forgot-password", forgotPasswordUser);
router.put("/reset-password/:resetToken", resetPasswordUser);

module.exports = router;