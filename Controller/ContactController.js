const express = require("express");
const router = express.Router();
const protectSession = require("../Middleware/AuthMiddleware");
const { sendContactMessage } = require("../Service/ContactService");

router.post('/', protectSession, sendContactMessage);

module.exports = router;