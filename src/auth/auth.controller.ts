import { Context } from "hono";
import { registerUserService, userLoginService } from "./auth.service";
import { sendRegistrationEmail } from "../nodemailer/mail";

export const registerUser = async (c: Context) => {
  try {
    //
    const user = await c.req.json();
    // const hashedPassword = await bcrypt.hash(user.password, 10);
    // user.password = hashedPassword;

    const createdUser = await registerUserService(user);

    if (!createdUser) {
      return c.text("User not created!👽", 404);
    } else if (createdUser === "user already exist") {
    }

    // Send registration email
    const emailSubject = "Welcome to Kephar's Eatery";
    const eventname = "Kephar's Eatery";
    const emailResponse = await sendRegistrationEmail(user.email, eventname);
    console.log(emailResponse);

    // Check if the email was successfully sent
    if (emailResponse && emailResponse.includes("not sent")) {
      return c.json({ msg: "User registered but email not sent." }, 500);
    }

    return c.json(
      { msg: "User registered successfully and email sent!👽" },
      201
    );
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
// Check if the user exists and verify credentials
export const loginUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    // Check if email and password are provided
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const result = await userLoginService(email, password);

    // Check if the result is null
    if (!result) {
      return c.json(
        { error: "Register First", details: "Invalid email or password" },
        400
      );
    }

    const { token, user } = result;
    // Return the token
    return c.json({ token, user }, 200);
  } catch (error: any) {
    console.error("Login error:", error); // Log the error for debugging
    return c.json({ error: "Register First", details: error.message }, 500);
  }
};
