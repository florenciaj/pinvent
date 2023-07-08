const express = require("express");
const router = express.Router();
const protectSession = require("../Middleware/AuthMiddleware");
const { createProduct, getProducts, getProduct } = require("../Service/ProductService");
const { uploadFile } = require("../Utils/UploadFile");

router.post('/', protectSession, uploadFile.single("photo"), createProduct);
router.get('/', protectSession, getProducts);
router.get('/:productId', protectSession, getProduct);

module.exports = router;