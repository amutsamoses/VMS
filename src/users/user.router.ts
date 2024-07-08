import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  listUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  userWithNameiLike,
} from "./user.controller";
import { userSchema } from "../validators";
import {
  adminRoleAuth,
  authMiddleware,
  userRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

export const userRouter = new Hono();

interface TUsers {
  id: number;
  name: string;
  email: string;
}

userRouter.get("/users", bothRoleAuth, listUsers);
userRouter.get("/users/:id", bothRoleAuth, getSingleUser);
userRouter.post(
  "/users",
  zValidator("json", userSchema, (results, c) => {
    if (!results.success) {
      return c.json(results.error, 400);
    }
  }),
  adminRoleAuth,
  createUser
);
userRouter.put("/users/:id", adminRoleAuth, updateUser);
userRouter.delete("/users/:id", adminRoleAuth, deleteUser);

userRouter.get("/users_with_name", userWithNameiLike);
