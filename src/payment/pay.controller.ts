import { Context } from "hono";

import {
  listPaymentService,
  limitPaymentService,
  getPaymentByIdService,
  createPaymentService,
  updatePaymentService,
  deletePaymentService,
} from "./pay.service";

export const listPayment = async (c: Context) => {
  try {
    const limit = c.req.query("limit")
      ? Number(c.req.query("limit"))
      : undefined;

    const payment = await listPaymentService();
    if (payment === null || payment.length === 0) {
      return c.text("No payment found", 404);
    }
    return c.json(payment, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const getPaymentById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const payment = await getPaymentByIdService(id);
    if (payment == null) {
      return c.text("Payment not found", 404);
    }
    return c.json(payment, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const createPayment = async (c: Context) => {
  try {
    const payment = await c.req.json();
    const result = await createPaymentService(payment);

    if (!result) {
      return c.text("Payment not created", 400);
    }
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const updatePayment = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);
    const payment = await c.req.json();

    const updatedPayment = await getPaymentByIdService(id);

    if (!updatedPayment === null) {
      return c.text("Payment not found", 404);
    }

    const result = await updatePaymentService(id, payment);

    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const deletePayment = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);

    const payment = await getPaymentByIdService(id);

    if (!payment) {
      return c.text("Payment not found", 404);
    }

    const result = await deletePaymentService(id);

    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const limitPayment = async (c: Context) => {
  try {
    const limit = parseInt(c.req.param("limit"));
    if (isNaN(limit)) {
      return c.text("Invalid limit", 400);
    }
    const payment = await limitPaymentService(limit);
    if (payment === null || payment.length === 0) {
      return c.text("No payment found", 404);
    }
    return c.json(payment, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};
