import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { paymentSchema } from "../validators";

import {
  listPayment,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  limitPayment,
  createPaymentIntent,
  paymentWithBooking,
  createCheckoutSession,
} from "./pay.controller";

import {
  adminRoleAuth,
  userRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

export const payRouter = new Hono();

payRouter.get("/payment", listPayment);
payRouter.get("/payment/:id", getPaymentById);

payRouter.post(
  "/payment",
  zValidator("json", paymentSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),

  createPayment
);

payRouter.put(
  "/payment/:id",
  zValidator("json", paymentSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),
  updatePayment
);

payRouter.delete("/payment/:id", deletePayment);

payRouter.get("/payment/limit/:limit", limitPayment);

payRouter.post("/payment-intent", createPaymentIntent);

payRouter.get("/payment-with-booking", paymentWithBooking);

payRouter.post("/checkout-session", createCheckoutSession);
