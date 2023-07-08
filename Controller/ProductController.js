const express = require("express");
const router = express.Router();
const protectSession = require("../Middleware/AuthMiddleware");
const { createProduct } = require("../Service/ProductService");
const { uploadFile } = require("../Utils/UploadFile");

router.post('/', protectSession, uploadFile.single("photo"), createProduct);

module.exports = router;