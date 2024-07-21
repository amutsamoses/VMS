import { Context } from "hono";

import {
  limitCustomerSupportTicketsService,
  getCustomerSupportTicketsByIdService,
  createCustomerSupportTicketsService,
  updateCustomerSupportTicketsService,
  deleteCustomerSupportTicketsService,
  listCustomerSupportTicketsService,
  customerSupportTicketsWithUserService,
} from "./customer.service";

export const listCustomerSupportTickets = async (c: Context) => {
  try {
    const limit = c.req.query("limit")
      ? Number(c.req.query("limit"))
      : undefined;

    const customerSupportTickets = await listCustomerSupportTicketsService();
    if (
      customerSupportTickets === null ||
      customerSupportTickets.length === 0
    ) {
      return c.text("No customer support tickets found", 404);
    }
    return c.json(customerSupportTickets, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const getCustomerSupportTicketsById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const customerSupportTickets =
      await getCustomerSupportTicketsByIdService(id);
    if (customerSupportTickets == null) {
      return c.text("Customer Support Ticket not found", 404);
    }
    return c.json(customerSupportTickets, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const createCustomerSupportTickets = async (c: Context) => {
  try {
    const customerSupportTickets = await c.req.json();
    const result = await createCustomerSupportTicketsService(
      customerSupportTickets
    );

    if (!result) {
      return c.text("Customer Support Ticket not created", 400);
    }
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const updateCustomerSupportTickets = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);
    const customerSupportTickets = await c.req.json();

    const updatedCustomerSupportTickets =
      await getCustomerSupportTicketsByIdService(id);

    if (!updatedCustomerSupportTickets === null) {
      return c.text("Customer Support Ticket not found", 404);
    }

    const result = await updateCustomerSupportTicketsService(
      id,
      customerSupportTickets
    );

    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const deleteCustomerSupportTickets = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) {
    return c.text("Invalid id", 400);
  }

  try {
    const ticket = await deleteCustomerSupportTicketsService(id);
    if (!ticket) {
      return c.text("Customer Support Ticket not deleted", 400);
    }

    const result = await deleteCustomerSupportTicketsService(id);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const limitCustomerSupportTickets = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));

    const customerSupportTickets =
      await limitCustomerSupportTicketsService(limit);
    if (
      customerSupportTickets === null ||
      customerSupportTickets.length === 0
    ) {
      return c.text("No customer support tickets found", 404);
    }
    return c.json(customerSupportTickets, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};


// customer with user
export const customerSupportTicketsWithUser = async (c: Context) => {
  try {
    const customerSupportTickets = await customerSupportTicketsWithUserService();
    if (
      customerSupportTickets === null ||
      customerSupportTickets.length === 0
    ) {
      return c.text("No customer support tickets found", 404);
    }
    return c.json(customerSupportTickets, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};