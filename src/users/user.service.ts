import { eq, ilike } from "drizzle-orm";
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
export const createUserService = async (user: TIUsers): Promise<TIUsers> => {
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
export const deleteUserService = async (id: number) => {
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

//get user with order
// export const userWithOrderService = async () => {
//   return await db.query.Users.findFirst({
//     with: {
//       orders: true,
//       addresses: true,
//       drivers: true,
//       comments: true,
//     },
//   });
// };
