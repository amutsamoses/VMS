import { Context } from "hono";

import {
  getBookingByIdService,
  listBookingService,
  limitBookingService,
  createBookingService,
  updateBookingService,
  deleteBookingService,
} from "./booking.service";

export const listBooking = async (c: Context) => {
  try {
    const limit = c.req.query("limit")
      ? Number(c.req.query("limit"))
      : undefined;

    const bookings = await listBookingService();
    if (bookings === null || bookings.length === 0) {
      return c.text("No bookings found", 404);
    }
    return c.json(bookings, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const getBookingById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const booking = await getBookingByIdService(id);
    if (booking == null) {
      return c.text("Booking not found", 404);
    }
    return c.json(booking, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const createBooking = async (c: Context) => {
  try {
    const booking = await c.req.json();
    const result = await createBookingService(booking);

    if (!result) {
      return c.text("Booking not created", 400);
    }
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const updateBooking = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);
    const booking = await c.req.json();

    const updatedBooking = await getBookingByIdService(id);

    if (!updatedBooking === null) {
      return c.text("Booking not found", 404);
    }

    const result = await updateBookingService(id, booking);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const deleteBooking = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);

    const booking = await getBookingByIdService(id);
    if (!booking) {
      return c.text("Booking not found", 404);
    }

    const result = await deleteBookingService(id);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const limitBooking = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));
    if (isNaN(limit)) {
      return c.text("Invalid limit", 400);
    }

    const bookings = await limitBookingService(limit);
    if (bookings === null || bookings.length === 0) {
      return c.text("No bookings found", 404);
    }
    return c.json(bookings, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};
