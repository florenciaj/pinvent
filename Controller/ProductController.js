const express = require("express");
const router = express.Router();
const protectSession = require("../Middleware/AuthMiddleware");
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = require("../Service/ProductService");
const { uploadFile } = require("../Utils/UploadFile");

router.post('/', protectSession, uploadFile.single("photo"), createProduct);
router.get('/', protectSession, getProducts);
router.get('/:productId', protectSession, getProduct);
router.delete('/:productId', protectSession, deleteProduct);
router.patch('/:productId', protectSession, uploadFile.single("photo"), updateProduct);

module.exports = router;