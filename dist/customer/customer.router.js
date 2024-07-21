"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const validators_1 = require("../validators");
const customer_controller_1 = require("./customer.controller");
exports.customerRouter = new hono_1.Hono();
exports.customerRouter.get("/customerSupportTickets", customer_controller_1.listCustomerSupportTickets);
exports.customerRouter.get("/customerSupportTickets/:id", customer_controller_1.getCustomerSupportTicketsById);
exports.customerRouter.post("/customerSupportTickets", (0, zod_validator_1.zValidator)("json", validators_1.customerSupportSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), customer_controller_1.createCustomerSupportTickets);
exports.customerRouter.put("/customerSupportTickets/:id", (0, zod_validator_1.zValidator)("json", validators_1.customerSupportSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), customer_controller_1.updateCustomerSupportTickets);
exports.customerRouter.delete("/customerSupportTickets/:id", customer_controller_1.deleteCustomerSupportTickets);
exports.customerRouter.get("/customerSupportTickets/limit", customer_controller_1.limitCustomerSupportTickets);
exports.customerRouter.get("/customerSupportTickets-users", customer_controller_1.customerSupportTicketsWithUser);
