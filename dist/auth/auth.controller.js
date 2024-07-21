"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const auth_service_1 = require("./auth.service");
const mail_1 = require("../nodemailer/mail");
const registerUser = async (c) => {
    try {
        //
        const user = await c.req.json();
        // const hashedPassword = await bcrypt.hash(user.password, 10);
        // user.password = hashedPassword;
        const createdUser = await (0, auth_service_1.registerUserService)(user);
        if (!createdUser) {
            return c.text("User not created!👽", 404);
        }
        else if (createdUser === "user already exist") {
        }
        // Send registration email
        const emailSubject = "Welcome to Kephar's Eatery";
        const eventname = "Kephar's Eatery";
        const emailResponse = await (0, mail_1.sendRegistrationEmail)(user.email, eventname);
        console.log(emailResponse);
        // Check if the email was successfully sent
        if (emailResponse && emailResponse.includes("not sent")) {
            return c.json({ msg: "User registered but email not sent." }, 500);
        }
        return c.json({ msg: "User registered successfully and email sent!👽" }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.registerUser = registerUser;
// Check if the user exists and verify credentials
const loginUser = async (c) => {
    try {
        const { email, password } = await c.req.json();
        // Check if email and password are provided
        if (!email || !password) {
            return c.json({ error: "Email and password are required" }, 400);
        }
        const result = await (0, auth_service_1.userLoginService)(email, password);
        // Check if the result is null
        if (!result) {
            return c.json({ error: "Login failed", details: "Invalid email or password" }, 400);
        }
        const { token, user } = result;
        // Return the token
        return c.json({ token, user }, 200);
    }
    catch (error) {
        console.error("Login error:", error); // Log the error for debugging
        return c.json({ error: "Login failed", details: error.message }, 500);
    }
};
exports.loginUser = loginUser;
