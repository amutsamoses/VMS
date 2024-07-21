"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const validators_1 = require("../validators");
const booking_controller_1 = require("./booking.controller");
const bearAuth_1 = require("../middleware/bearAuth");
exports.bookingRouter = new hono_1.Hono();
exports.bookingRouter.get("/bookings", bearAuth_1.adminRoleAuth, booking_controller_1.listBooking);
exports.bookingRouter.get("/bookings/:id", bearAuth_1.bothRoleAuth, booking_controller_1.getBookingById);
exports.bookingRouter.post("/bookings", (0, zod_validator_1.zValidator)("json", validators_1.bookingSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), bearAuth_1.adminRoleAuth, booking_controller_1.createBooking);
exports.bookingRouter.put("/bookings/:id", (0, zod_validator_1.zValidator)("json", validators_1.bookingSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), bearAuth_1.adminRoleAuth, booking_controller_1.updateBooking);
exports.bookingRouter.delete("/bookings/:id", bearAuth_1.adminRoleAuth, booking_controller_1.deleteBooking);
exports.bookingRouter.get("/bookings", booking_controller_1.limitBooking);
exports.bookingRouter.get("/bookings-users", booking_controller_1.bookingWithUser);
