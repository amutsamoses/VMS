import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { customerSupportSchema } from "../validators";

import {
  listCustomerSupportTickets,
  getCustomerSupportTicketsById,
  createCustomerSupportTickets,
  updateCustomerSupportTickets,
  deleteCustomerSupportTickets,
  limitCustomerSupportTickets,
  customerSupportTicketsWithUser,
} from "./customer.controller";
import {
  adminRoleAuth,
  userRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

export const customerRouter = new Hono();

customerRouter.get("/customerSupportTickets", listCustomerSupportTickets);

customerRouter.get(
  "/customerSupportTickets/:id",

  getCustomerSupportTicketsById
);

customerRouter.post(
  "/customerSupportTickets",
  zValidator("json", customerSupportSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),
  createCustomerSupportTickets
);

customerRouter.put(
  "/customerSupportTickets/:id",
  zValidator("json", customerSupportSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),
  updateCustomerSupportTickets
);

customerRouter.delete(
  "/customerSupportTickets/:id",
  deleteCustomerSupportTickets
);

customerRouter.get(
  "/customerSupportTickets/limit",
  limitCustomerSupportTickets
);

customerRouter.get(
  "/customerSupportTickets-users",
  customerSupportTicketsWithUser
);
