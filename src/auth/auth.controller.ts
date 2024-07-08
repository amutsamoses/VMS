import { Context } from "hono";
import "dotenv/config";
import { registerAuthUserService, userLoginService } from "./auth.service";
import * as bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { sendRegistrationEmail } from "../nodemailer/mail";
import { jwt } from "hono/jwt";
import { verify } from "hono/jwt";

const secret = process.env.SECRET;
const expiresIn = process.env.EXPIRES;

export const registerUser = async (c: Context) => {
  try {
    const user = await c.req.json();

    const pass = user.password;
    const hashedPassword = await bcrypt.hash(pass, 10);
    user.password = hashedPassword;

    if (!["user", "admin"].includes(user.role)) {
      return c.json({ error: "Invalid role" }, 400);
    }

    const createdUser = await registerAuthUserService(user);

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

export const loginUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    // console.log("User input:", user);

    // check if the user exist
    const userExist = await userLoginService(email, password);
    // console.log("User exist:", userExist);

    // check if the user exist in the database or not
    if (userExist === null) {
      return c.json({ error: "user not found" }, 404);
    }

    // compare the password with the hashed password
    const userMatch = await bcrypt.compare(
      password as string,
      userExist?.password as string
    );
    // console.log("Password match:", userMatch);

    if (!userMatch) {
      return c.json({ error: "password does not match" }, 401);
    } else {
      // create the payload for the jwt token
      const payload = {
        sub: email,
        role: userExist.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 2880, // 2 days expiration time for the token
      };

      let secret = process.env.JWT_SECRET as string; // secret key for jwt
      const token = await sign(payload, secret); // sign the token with the payload and secret key
      let authDetails = email; // get the user from the userExist object
      let role = userExist?.role; // get the role from the userExist object

      return c.json({ token, user: { role, ...authDetails } }, 200); // return the token and user object
    }
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, secret!);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
