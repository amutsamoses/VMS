"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingWithUserService = exports.bookingWithUserService = exports.deleteBookingService = exports.updateBookingService = exports.createBookingService = exports.checkBookingService = exports.getBookingByIdService = exports.limitBookingService = exports.listBookingService = void 0;
const db_1 = require("../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
const listBookingService = async (limit) => {
    if (limit) {
        return await db_1.default.query.Bookings.findMany({
            limit: limit,
        });
    }
    return await db_1.default.query.Bookings.findMany();
};
exports.listBookingService = listBookingService;
const limitBookingService = async (limit) => {
    return await db_1.default.select().from(schema_1.Bookings).limit(limit).execute();
};
exports.limitBookingService = limitBookingService;
const getBookingByIdService = async (id) => {
    return await db_1.default.query.Bookings.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.Bookings.booking_id, id),
    });
};
exports.getBookingByIdService = getBookingByIdService;
// check if there is overlapping booking in that
// a user cannot book a vehicle that is already booked by another user
const checkBookingService = async (vehicleId, start_date, end_date) => {
    const overLappingBookings = await db_1.default.query.Bookings.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Bookings.vehicle_id, vehicleId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Bookings.booking_date, start_date), (0, drizzle_orm_1.eq)(schema_1.Bookings.return_date, end_date)), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Bookings.booking_date, end_date), (0, drizzle_orm_1.eq)(schema_1.Bookings.return_date, start_date)))),
    });
    return overLappingBookings.length > 0;
};
exports.checkBookingService = checkBookingService;
const createBookingService = async (booking) => {
    //ensure the vehicle id is not undefined or null before creating a booking
    if (!booking.vehicle_id) {
        throw new Error("Vehicle id is required!");
    }
    // validate the booking date and return date to ensure the booking date is not greater than the return date
    if (new Date(booking.booking_date) >= new Date(booking.return_date)) {
        throw new Error("Booking date must be before the return date!");
    }
    //check if a user has already booked the vehicle
    const isBooked = await (0, exports.checkBookingService)(booking.vehicle_id, new Date(booking.booking_date), new Date(booking.return_date));
    if (isBooked) {
        throw new Error("Vehicle is already booked for the selected date range!");
    }
    //insert the booking into the database
    try {
        const newBooking = await db_1.default
            .insert(schema_1.Bookings)
            .values(booking)
            .returning()
            .execute();
        //log the results to the console for debugging
        console.log("Failed to insert", newBooking);
        //return the newly created booking
        return newBooking[0];
    }
    catch (error) {
        throw new Error("Failed to create booking!");
    }
};
exports.createBookingService = createBookingService;
const updateBookingService = async (id, booking) => {
    await db_1.default.update(schema_1.Bookings).set(booking).where((0, drizzle_orm_1.eq)(schema_1.Bookings.booking_id, id));
    return "Booking updated successfully!";
};
exports.updateBookingService = updateBookingService;
const deleteBookingService = async (id) => {
    await db_1.default.delete(schema_1.Bookings).where((0, drizzle_orm_1.eq)(schema_1.Bookings.booking_id, id));
    return "Booking deleted successfully!";
};
exports.deleteBookingService = deleteBookingService;
//booking with user, vehicle, location and payment service
const bookingWithUserService = async () => {
    return await db_1.default.query.Bookings.findMany({
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
exports.bookingWithUserService = bookingWithUserService;
// fetching booking by id with user, vehicle, location and payment service
const getBookingWithUserService = async (id) => {
    return await db_1.default.query.Bookings.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.Bookings.booking_id, id),
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
exports.getBookingWithUserService = getBookingWithUserService;
