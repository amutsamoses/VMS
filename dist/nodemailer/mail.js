"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRegistrationEmail = exports.sendEmail = void 0;
const nodemailer = require("nodemailer");
const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `${subject}`,
            text: message,
            html: `<b>${message}</b>`,
        };
        const mailRes = await transporter.sendMail(mailOptions);
        let mailResponse = "";
        if (mailRes.accepted.length > 0) {
            mailResponse = "Email sent successfully";
        }
        else if (mailRes.rejected.length > 0) {
            mailResponse = "Email rejected, please try again";
        }
        else {
            mailResponse = "Email not sent";
        }
        return mailResponse;
    }
    catch (error) {
        return JSON.stringify(error.message);
    }
};
exports.sendEmail = sendEmail;
const sendRegistrationEmail = async (userMail, eventName) => {
    try {
        const subject = "Registration Successful";
        const message = `Thank you for registering for ${eventName}`;
        const mailRes = await (0, exports.sendEmail)(userMail, subject, message);
        return mailRes;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.sendRegistrationEmail = sendRegistrationEmail;
