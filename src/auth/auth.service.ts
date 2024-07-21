import { eq } from "drizzle-orm";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import db from "../drizzle/db";
import {
  Authentication,
  TIAuthentication,
  TIUsers,
  TSAuthentication,
  Users,
} from "../drizzle/schema";
import { userSchema, registerUserSchema, loginUserSchema } from "../validators";

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.EXPIRES;

export const registerUserService = async (
  user: TIUsers & TIAuthentication
): Promise<string | null> => {
  // Validate the user data using parse method to check if the data is valid
  userSchema.parse(user);
  registerUserSchema.parse(user);

  //check if the user already exist
  const userExist = await db
    .select()
    .from(Users)
    .where(eq(Users.email, user.email))
    .execute();

  if (userExist.length > 0) {
    throw new Error("user with credentials already exist");
  }

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  // Insert the data into the Users table
  const newUser = await db
    .insert(Users)
    .values({
      full_name: user.full_name,
      email: user.email,
      contact_phone: user.contact_phone,
      address: user.address,
      role: user.role,
    })
    .returning({ id: Users.user_id })
    .execute();

  //insert the data into the Authentication table
  const user_id = newUser[0].id;

  try {
    await db
      .insert(Authentication)
      .values({
        user_id: user_id,
        password: hashedPassword,
      })
      .execute();
    return "User registered successfully!👽";
  } catch (error) {
    // rollback: delete the user from the Users table if it fails to insert into the Authentication table by id
    await db.delete(Users).where(eq(Users.user_id, user_id)).execute();
    throw new Error("Failed to register user");
  }
};

export const userLoginService = async (email: string, password: string) => {
  try {
    // Validate the user data using parse method to check if the data is valid using loginUserSchema
    loginUserSchema.parse({ email, password });

    // Find the user in the Users table by email
    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .execute();

    if (users.length === 0) {
      return null; // User not found
    }

    // Get the user object from the Users table
    const user = users[0];

    // Get the user's password from the Authentication table
    const auths = await db
      .select()
      .from(Authentication)
      .where(eq(Authentication.user_id, user.user_id))
      .execute();

    if (auths.length === 0) {
      throw new Error("Authentication record not found for user_id"); // Authentication details not found
    }

    //fetch the user's hashed password from the Authentication table
    const hashedPassword = auths[0];

    //check if the provided password matches the hashed password
    const passwordsMatch = await bcrypt.compare(
      password,
      hashedPassword.password
    );

    if (!passwordsMatch) {
      console.error("Invalid password", user);
      throw new Error("Invalid password");
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      secret!,
      { expiresIn }
    );
    console.log("token", token);
    return { token, user };
  } catch (error) {
    console.error("User login service error:", error); // Log the error for debugging
    throw new Error("Failed to login user");
  }
};
