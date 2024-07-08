import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginUserSchema, registerUserSchema } from "../validators";
import { loginUser, registerUser } from "./auth.controller";
// import { register } from "module";

export const authRouter = new Hono();

authRouter.get("/v1", (c) => {
  return c.text("auth route");
});
authRouter.post(
  "/register",
  zValidator("json", registerUserSchema, (results, c) => {
    if (!results.success) {
      return c.json(results.error, 400);
    }
  }),
  registerUser
);

authRouter.post(
  "/login",
  zValidator("json", loginUserSchema, (results, c) => {
    if (!results.success) {
      return c.json(results.error, 400);
    }
  }),
  loginUser
);
