const express = require("express");
const router = express.Router();
const protectSession = require("../Middleware/AuthMiddleware");
const { createProduct } = require("../Service/ProductService");

router.post('/', protectSession, createProduct);

module.exports = router;