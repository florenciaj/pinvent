const asyncHandler = require('express-async-handler');
const User = require('../Model/UserModel');
const sendEmail = require("../Utils/SendEmail");

const sendContactMessage = asyncHandler(async (req, res) => {
    const { subject, message } = req.body;
    if (!subject || !message) {
        res.status(400);
        throw new Error("Subject and message are required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const sendTo = process.env.EMAIL_USER;
    const sentFrom = process.env.EMAIL_USER;
    const replyTo = user.email;

    try {
        await sendEmail(subject, message, sendTo, sentFrom, replyTo);
        res.status(200).json({ success: true, message: "Email successfully sent" });

    } catch (error) {
        res.status(404);
        throw new Error("Could not send email to user");
    }

    res.status(200).json({ message: "Email successfully sent" });
});

module.exports = {
    sendContactMessage
};