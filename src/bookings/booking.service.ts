import db from "../drizzle/db";
import { and, eq, or } from "drizzle-orm";
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

// check if there is overlapping booking in that
// a user cannot book a vehicle that is already booked by another user
export const checkBookingService = async (
  vehicleId: number,
  start_date: Date,
  end_date: Date
) => {
  const overLappingBookings = await db.query.Bookings.findMany({
    where: and(
      eq(Bookings.vehicle_id, vehicleId),
      or(
        and(
          eq(Bookings.booking_date, start_date),
          eq(Bookings.return_date, end_date)
        ),
        and(
          eq(Bookings.booking_date, end_date),
          eq(Bookings.return_date, start_date)
        )
      )
    ),
  });
  return overLappingBookings.length > 0;
};

export const createBookingService = async (
  booking: TIBookings
): Promise<TIBookings> => {
  //ensure the vehicle id is not undefined or null before creating a booking
  if (!booking.vehicle_id) {
    throw new Error("Vehicle id is required!");
  }

  // validate the booking date and return date to ensure the booking date is not greater than the return date
  if (new Date(booking.booking_date) >= new Date(booking.return_date)) {
    throw new Error("Booking date must be before the return date!");
  }

  //check if a user has already booked the vehicle
  const isBooked = await checkBookingService(
    booking.vehicle_id,
    new Date(booking.booking_date),
    new Date(booking.return_date)
  );
  if (isBooked) {
    throw new Error("Vehicle is already booked for the selected date range!");
  }

  //insert the booking into the database
  try {
    const newBooking = await db
      .insert(Bookings)
      .values(booking)
      .returning()
      .execute();

    //log the results to the console for debugging
    console.log("Failed to insert", newBooking);

    //return the newly created booking
    return newBooking[0] as TIBookings;
  } catch (error) {
    throw new Error("Failed to create booking!");
  }
};

export const updateBookingService = async (
  id: number,
  booking: TIBookings
): Promise<string> => {
  await db.update(Bookings).set(booking).where(eq(Bookings.booking_id, id));
  return "Booking updated successfully!";
};

export const deleteBookingService = async (id: number): Promise<string> => {
  await db.delete(Bookings).where(eq(Bookings.booking_id, id));
  return "Booking deleted successfully!";
};

//booking with user, vehicle, location and payment service
export const bookingWithUserService = async (): Promise<TSBookings[] | any> => {
  return await db.query.Bookings.findMany({
    columns: {
      booking_date: true,
      return_date: true,
      total_amount: true,
      booking_status: true,
    },
    with: {
      user: {
        columns: {
          full_name: true,
          email: true,
          contact_phone: true,
          address: true,
          role: true,
        },
      },
      vehicle: {
        columns: {
          rental_rate: true,
          availability: true,
        },
        with: {
          vehicleSpec: {
            columns: {
              vehicleSpec_id: false,
              created_at: false,
              updated_at: false,
            },
          },
        },
      },
      location: {
        columns: {
          name: true,
          address: true,
          contact_phone: true,
        },
      },
      payments: {
        columns: {
          amount: true,
          payment_status: true,
          payment_date: true,
          payment_method: true,
          transaction_id: true,
        },
      },
    },
  });
};

// fetching booking by id with user, vehicle, location and payment service
export const getBookingWithUserService = async (
  id: number
): Promise<TSBookings | undefined> => {
  return await db.query.Bookings.findFirst({
    where: eq(Bookings.booking_id, id),
    with: {
      user: {
        columns: {
          full_name: true,
          email: true,
          contact_phone: true,
          address: true,
          role: true,
        },
      },
      vehicle: {
        columns: {
          rental_rate: true,
          availability: true,
        },
        with: {
          vehicleSpec: {
            columns: {
              vehicleSpec_id: false,
              created_at: false,
              updated_at: false,
            },
          },
        },
      },
      location: {
        columns: {
          name: true,
          address: true,
          contact_phone: true,
        },
      },
      payments: {
        columns: {
          amount: true,
          payment_status: true,
          payment_date: true,
          payment_method: true,
          transaction_id: true,
        },
      },
    },
  });
};
