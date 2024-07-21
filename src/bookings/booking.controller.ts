import { Context } from "hono";

import {
  getBookingByIdService,
  listBookingService,
  limitBookingService,
  createBookingService,
  updateBookingService,
  deleteBookingService,
  bookingWithUserService,
  checkBookingService,
} from "./booking.service";
import { TIBookings, TSBookings } from "../drizzle/schema";

export const listBooking = async (c: Context): Promise<TSBookings | any> => {
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

export const getBookingById = async (c: Context): Promise<TIBookings | any> => {
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
    const booking: TIBookings = await c.req.json();

    //convert booking_date and return_date to string
    if (booking.booking_date) {
      booking.booking_date = new Date(booking.booking_date);
    }

    if (booking.return_date) {
      booking.return_date = new Date(booking.return_date);
    }

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

    //convert booking_date and return_date to string
    if (booking.booking_date) {
      booking.booking_date = new Date(booking.booking_date);
    }

    if (booking.return_date) {
      booking.return_date = new Date(booking.return_date);
    }

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

export const bookingWithUser = async (c: Context) => {
  try {
    const bookings = await bookingWithUserService();
    if (bookings === null || bookings.length === 0) {
      return c.text("No bookings found", 404);
    }
    return c.json(bookings, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

// Check if a booking exists
export const checkBooking = async (c: Context) => {
  try {
    const booking = await c.req.json();
    const { vehicleId, start_date, end_date } = booking; // Extract vehicleId, start_date, and end_date from the booking object
    const result = await checkBookingService(vehicleId, start_date, end_date); // Pass the required arguments to the checkBookingService function

    if (!result) {
      return c.text("Booking not found", 404);
    }
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};
