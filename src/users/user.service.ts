import { eq, ilike, and } from "drizzle-orm";
import db from "../drizzle/db";
import { TIUsers, TSUsers, Users } from "../drizzle/schema";

export const userService = async (): Promise<TSUsers[] | null> => {
  return await db.query.Users.findMany();
};

//get one user
export const getSingleUserService = async (
  id: number
): Promise<TSUsers | undefined> => {
  return await db.query.Users.findFirst({
    where: eq(Users.user_id, id),
  });
};

//create user
export const createUserService = async (user: TIUsers): Promise<TIUsers | string> => {
  const { email, contact_phone } = user;

  if (!email || !contact_phone) {
    throw new Error("Email or Contact Phone is undefined.");
  }

  //check if the email and contact_phone exists in the database
  const existingUser = await db.select().from(Users).where(
    and(
      eq(Users.email, email),
      eq(Users.contact_phone, contact_phone)  
    )
  ).execute();

  if (existingUser){
    return "A user with this email and contact_phone already exists.";
  }

  await db.insert(Users).values(user);
  return user;
};

//update user
export const updateUserService = async (
  id: number,
  user: TIUsers
): Promise<TIUsers> => {
  await db.update(Users).set(user).where(eq(Users.user_id, id));
  return user;
};
//delete user
export const deleteUserService = async (id: number): Promise<string> => {
  await db.delete(Users).where(eq(Users.user_id, id));
  return "user deleted successfully!😑";
};

export const userWithNameiLikeService = async (
  name: string
): Promise<string | TSUsers[]> => {
  return await db
    .select()
    .from(Users)
    .where(ilike(Users.full_name, `%${name}%`));
};

//user with bookings and customer support tickets
export const userWithDetailService = async () => {
  return await db.query.Users.findMany({
    columns: {
      user_id: false,
      created_at: false,
      updated_at: false,
    },
    with: {
      bookings: {
        columns: {
          booking_date: true,
          return_date: true,
          total_amount: true,
          booking_status: true,
        },
      },
    },
  });
};
