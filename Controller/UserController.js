const asyncHandler = require("express-async-handler")
const User = require("../Model/UserModel");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Fill in all required fields");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be up to 6 characters");
    }

    const userEmailExists = await User.findOne({ email });
    if (userEmailExists) {
        res.status(400);
        throw new Error("Email has already been registered");
    }

    const newUser = await User.create({
        name,
        email,
        password
    });

    if (newUser) {
        const { _id, name, email, phone, bio } = newUser;
        res.status(201).json({ _id, name, email, phone, bio });
    } else {
        res.status(500);
        throw new Error("Invalid user data");
    }

})

module.exports = {
    registerUser
}