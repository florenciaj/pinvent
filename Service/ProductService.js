const asyncHandler = require('express-async-handler');
const Product = require('../Model/ProductModel');

const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, amount, price, description } = req.body;

    if (!name || !category || !amount || !price || !description) {
        res.status(400);
        throw new Error("Fill all required fields");
    }

    const product = await Product.create({
        user: req.user.id,
        name,
        sku,
        category,
        amount,
        price,
        description
    });

    res.status(201).json(product);
});

module.exports = {
    createProduct
};