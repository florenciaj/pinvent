const asyncHandler = require("express-async-handler")
const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const generateToken = (userId) => {
    return JWT.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

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
        const token = generateToken(_id);
        const today = new Date(), tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1)

        // send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: tomorrow,
            sameSite: "none",
            secure: true
        });

        res.status(201).json({ _id, name, email, phone, bio, token });
    } else {
        res.status(500);
        throw new Error("Invalid user data");
    }

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Fill in all required fields");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
        const { _id, name, email, phone, bio } = user;

        const token = generateToken(_id);
        const today = new Date(), tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1)

        // send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: tomorrow,
            sameSite: "none",
            secure: true
        });

        res.status(200).json({ _id, name, email, phone, bio, token });
    } else {
        res.status(400);
        throw new Error("Invalid user or password");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });

    res.status(200).json({ message: "Successfully logged out" });
});

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const { _id, name, email, phone, bio } = user;
        res.status(200).json({ _id, name, email, phone, bio });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser
}