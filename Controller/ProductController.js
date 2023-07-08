const express = require("express");
const router = express.Router();
const protectSession = require("../Middleware/AuthMiddleware");
const { createProduct, getProducts } = require("../Service/ProductService");
const { uploadFile } = require("../Utils/UploadFile");

router.post('/', protectSession, uploadFile.single("photo"), createProduct);
router.get('/', protectSession, getProducts);

module.exports = router;