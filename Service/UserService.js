const asyncHandler = require("express-async-handler")
const User = require("../Model/UserModel");
const Token = require("../Model/TokenModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../Utils/SendEmail");

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
        res.status(404);
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

const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }

    const verified = JWT.verify(token, process.env.JWT_SECRET);
    return res.json(typeof verified !== 'undefined');
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const { name, phone, photo, bio } = user;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        photo: updatedUser.photo,
        bio: updatedUser.bio,
        token: updatedUser.token
    });
});

const changePasswordUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        res.status(404);
        throw new Error("Add a password");
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (isPasswordCorrect) {
        user.password = newPassword;
        await user.save();
        res.status(200).send("Password updated");
    } else {
        res.status(404);
        throw new Error("Wrong password");
    }
});

const forgotPasswordUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    let token = await Token.findOne({ userId: user._id });
    if (token) {
        await Token.deleteMany({ userId: user._id });
    }

    let resetToken = crypto.randomBytes(32).toString("HEX") + user._id;
    const hashedToken = crypto.createHash("SHA256").update(resetToken).digest("HEX");

    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);

    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: expirationDate
    }).save();

    const resetURL = `${process.env.FRONTEND_API_URL}/reset-password/${resetToken}`;
    const message = `
    <h2>Hello, ${user.name}</h2>
    <p>Please click on the following link to reset your password:</p>
    <a href="${resetURL}" clicktracking=off>${resetURL}</a>
    <p>This link will expire in 30 minutes</p>
    `;
    const subject = "Password reset request";
    const sendTo = user.email;
    const sentFrom = process.env.EMAIL_USER;

    try {
        await sendEmail(subject, message, sendTo, sentFrom);
        res.status(200).json({ success: true, message: "Reset email successfully sent" });

    } catch (error) {
        res.status(404);
        throw new Error("Could not send email to user");
    }
});

const resetPasswordUser = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;

    if (!resetToken) {
        res.status(404);
        throw new Error("Reset token is required");
    }
    
    const hashedToken = crypto.createHash("SHA256").update(resetToken).digest("HEX");
    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: { $gt: Date.now() }
    });

    if (!userToken) {
        res.status(404);
        throw new Error("Invalid or expired token");
    }

    const user = await User.findOne({ _id: userToken.userId });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.password = password;
    await user.save();

    res.status(200).send({ message: "Password updated" });
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePasswordUser,
    forgotPasswordUser,
    resetPasswordUser
}