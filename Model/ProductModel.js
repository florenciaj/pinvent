const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Add user"],
        reference: "User"
    },
    name: {
        type: String,
        required: [true, "Add a name"],
        trim: true
    },
    sku: {
        type: String,
        required: true,
        default: "SKU",
        trim: true
    },
    category: {
        type: String,
        required: [true, "Add a category"],
        trim: true
    },
    amount: {
        type: String,
        required: [true, "Add a amount"],
        trim: true
    },
    price: {
        type: String,
        required: [true, "Add a price"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Add a description"],
        trim: true
    },
    photo: {
        type: Object,
        default: {}
    },
}, {
    timestamps: true
});

const Product = mongoose.mongoose.model("Product", ProductSchema);
module.exports = Product;