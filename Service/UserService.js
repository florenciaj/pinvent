const express = require("express");
const { registerUser, loginUser, logoutUser, getUser } = require("../Controller/UserController");
const protectUser = require("../Middleware/AuthMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protectUser, getUser);

module.exports = router;