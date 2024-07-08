import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { Bookings, TIBookings, TSBookings } from "../drizzle/schema";

export const listBookingService = async (
  limit?: number
): Promise<TSBookings[] | null> => {
  if (limit) {
    return await db.query.Bookings.findMany({
      limit: limit,
    });
  }
  return await db.query.Bookings.findMany();
};

export const limitBookingService = async (
  limit: number
): Promise<TSBookings[] | null> => {
  return await db.select().from(Bookings).limit(limit).execute();
};

export const getBookingByIdService = async (
  id: number
): Promise<TSBookings | undefined> => {
  return await db.query.Bookings.findFirst({
    where: eq(Bookings.booking_id, id),
  });
};

export const createBookingService = async (booking: TIBookings) => {
  await db.insert(Bookings).values(booking);
  return "Booking created successfully!";
};

export const updateBookingService = async (id: number, booking: TIBookings) => {
  await db.update(Bookings).set(booking).where(eq(Bookings.booking_id, id));
  return "Booking updated successfully!";
};

export const deleteBookingService = async (id: number) => {
  await db.delete(Bookings).where(eq(Bookings.booking_id, id));
  return "Booking deleted successfully!";
};
