import db from "../drizzle/db";
import {
  Authentication,
  TIAuthentication,
  TSAuthentication,
  Users,
} from "../drizzle/schema";
import { sql, eq } from "drizzle-orm";

export const registerAuthUserService = async (
  user: TIAuthentication & any
): Promise<string | null> => {
  const { email, password, role, ...rest } = user;
  //check if the user already exist
  const userExist = await db
    .select()
    .from(Users)
    .where(eq(Users.email, email))
    .execute();

  if (userExist.length > 0) {
    // throw new Error("user already exist");
    return "user already exist";
  }

  const newUser = await db
    .insert(Users)
    .values(email, role, ...rest)
    .returning("*")
    .execute();

  await db
    .insert(Authentication)
    .values({ user_id: newUser[0].user_id, password })
    .execute();
  return "user created successfully! 👽";
};

export const userLoginService = async (email: string, password: string) => {
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.email, email))
    .execute();

  if (user.length === 0) {
    return null;
  }

  // Get the user's password from the Authentication table
  const auth = await db
    .select()
    .from(Authentication)
    .where(eq(Authentication.user_id, user[0].user_id))
    .execute();

  return {
    email: user[0].email,
    role: user[0].role,
    password: auth[0].password,
  };
};
