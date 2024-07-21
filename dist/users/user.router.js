"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const user_controller_1 = require("./user.controller");
const validators_1 = require("../validators");
exports.userRouter = new hono_1.Hono();
exports.userRouter.get("/users", user_controller_1.listUsers);
exports.userRouter.get("/users/:id", user_controller_1.getSingleUser);
exports.userRouter.post("/users", (0, zod_validator_1.zValidator)("json", validators_1.userSchema, (results, c) => {
    if (!results.success) {
        return c.json(results.error, 400);
    }
}), user_controller_1.createUser);
exports.userRouter.put("/users/:id", user_controller_1.updateUser);
exports.userRouter.delete("/users/:id", user_controller_1.deleteUser);
exports.userRouter.get("/users_with_name", user_controller_1.userWithNameiLike);
exports.userRouter.get("/userswithdetails", user_controller_1.userWithDetail);
