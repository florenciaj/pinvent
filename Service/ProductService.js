const asyncHandler = require('express-async-handler');
const Product = require('../Model/ProductModel');
const { fileSizeFormatter } = require('../Utils/UploadFile');
const cloudinary = require('cloudinary').v2;

const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, amount, price, description } = req.body;
    console.log('0');

    if (!name || !category || !amount || !price || !description) {
        res.status(400);
        throw new Error("Fill all required fields");
    }

    let fileData = {};
    if (req.file) {

        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Pinvent app", resourse_type: "image" });
        } catch (error) {
            res.status(500);
            throw new Error("Image upload failed");
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2)
        };
    }

    const product = await Product.create({
        user: req.user.id,
        name,
        sku,
        category,
        amount,
        price,
        description,
        photo: fileData
    });

    res.status(201).json(product);
});

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json(products);
});

const getProduct = asyncHandler(async (req, res) => {
    if (!req.params.productId.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.user.toString() != req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    res.status(200).json(product);
});

module.exports = {
    createProduct,
    getProducts,
    getProduct
};