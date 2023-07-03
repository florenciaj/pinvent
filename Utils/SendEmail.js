const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, sentTo, sentFrom, replyTo) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const options = {
        from: sentFrom,
        to: sentTo,
        replyTo: replyTo,
        subject: subject,
        html: message
    }

    transporter.sendMail(options, function (error, info) { });
}

module.exports = sendEmail;