"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const validators_1 = require("../validators");
const pay_controller_1 = require("./pay.controller");
exports.payRouter = new hono_1.Hono();
exports.payRouter.get("/payment", pay_controller_1.listPayment);
exports.payRouter.get("/payment/:id", pay_controller_1.getPaymentById);
exports.payRouter.post("/payment", (0, zod_validator_1.zValidator)("json", validators_1.paymentSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), pay_controller_1.createPayment);
exports.payRouter.put("/payment/:id", (0, zod_validator_1.zValidator)("json", validators_1.paymentSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), pay_controller_1.updatePayment);
exports.payRouter.delete("/payment/:id", pay_controller_1.deletePayment);
exports.payRouter.get("/payment/limit/:limit", pay_controller_1.limitPayment);
exports.payRouter.post("/payment-intent", pay_controller_1.createPaymentIntent);
exports.payRouter.get("/payment-with-booking", pay_controller_1.paymentWithBooking);
exports.payRouter.post("/checkout-session", pay_controller_1.createCheckoutSession);
