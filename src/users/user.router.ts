import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  listUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  userWithNameiLike,
  userWithDetail,
} from "./user.controller";
import { userSchema } from "../validators";
import {
  adminRoleAuth,
  userRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

export const userRouter = new Hono();

interface TUsers {
  id: number;
  name: string;
  email: string;
}

userRouter.get("/users", listUsers);
userRouter.get("/users/:id", getSingleUser);
userRouter.post(
  "/users",
  zValidator("json", userSchema, (results, c) => {
    if (!results.success) {
      return c.json(results.error, 400);
    }
  }),

  createUser
);
userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);

userRouter.get("/users_with_name", userWithNameiLike);

userRouter.get("/userswithdetails", userWithDetail);
