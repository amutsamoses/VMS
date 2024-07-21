"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const validators_1 = require("../validators");
const auth_controller_1 = require("./auth.controller");
// import { register } from "module";
exports.authRouter = new hono_1.Hono();
exports.authRouter.get("/v1", (c) => {
    return c.text("auth route");
});
exports.authRouter.post("/register", (0, zod_validator_1.zValidator)("json", validators_1.registerUserSchema, (results, c) => {
    if (!results.success) {
        return c.json(results.error, 400);
    }
}), auth_controller_1.registerUser);
exports.authRouter.post("/login", (0, zod_validator_1.zValidator)("json", validators_1.loginUserSchema, (results, c) => {
    if (!results.success) {
        return c.json(results.error, 400);
    }
}), auth_controller_1.loginUser);
