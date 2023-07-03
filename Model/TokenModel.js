const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Add user reference"],
        reference: "User"
    },
    token: {
        type: String,
        required: [true, "Add a token"],
    },
    createdAt: {
        type: Date,
        required: [true, "Add created at token date"],
    },
    expiresAt: {
        type: Date,
        required: [true, "Add expires at token date"],	
    },
});

const Token = mongoose.mongoose.model("Token", TokenSchema);
module.exports = Token;