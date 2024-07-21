import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { bookingSchema } from "../validators";

import {
  listBooking,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  limitBooking,
  bookingWithUser,
} from "./booking.controller";
import {
  adminRoleAuth,
  userRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

export const bookingRouter = new Hono();

bookingRouter.get("/bookings", adminRoleAuth, listBooking);
bookingRouter.get("/bookings/:id", bothRoleAuth, getBookingById);

bookingRouter.post(
  "/bookings",
  zValidator("json", bookingSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),
  adminRoleAuth,
  createBooking
);

bookingRouter.put(
  "/bookings/:id",
  zValidator("json", bookingSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),
  adminRoleAuth,
  updateBooking
);

bookingRouter.delete("/bookings/:id", adminRoleAuth, deleteBooking);

bookingRouter.get("/bookings", limitBooking);

bookingRouter.get("/bookings-users", bookingWithUser);
