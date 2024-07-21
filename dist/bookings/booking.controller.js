"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBooking = exports.bookingWithUser = exports.limitBooking = exports.deleteBooking = exports.updateBooking = exports.createBooking = exports.getBookingById = exports.listBooking = void 0;
const booking_service_1 = require("./booking.service");
const listBooking = async (c) => {
    try {
        const limit = c.req.query("limit")
            ? Number(c.req.query("limit"))
            : undefined;
        const bookings = await (0, booking_service_1.listBookingService)();
        if (bookings === null || bookings.length === 0) {
            return c.text("No bookings found", 404);
        }
        return c.json(bookings, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.listBooking = listBooking;
const getBookingById = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const booking = await (0, booking_service_1.getBookingByIdService)(id);
        if (booking == null) {
            return c.text("Booking not found", 404);
        }
        return c.json(booking, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.getBookingById = getBookingById;
const createBooking = async (c) => {
    try {
        const booking = await c.req.json();
        //convert booking_date and return_date to string
        if (booking.booking_date) {
            booking.booking_date = new Date(booking.booking_date);
        }
        if (booking.return_date) {
            booking.return_date = new Date(booking.return_date);
        }
        const result = await (0, booking_service_1.createBookingService)(booking);
        if (!result) {
            return c.text("Booking not created", 400);
        }
        return c.json({ message: result }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.createBooking = createBooking;
const updateBooking = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id))
            return c.text("Invalid id", 400);
        const booking = await c.req.json();
        //convert booking_date and return_date to string
        if (booking.booking_date) {
            booking.booking_date = new Date(booking.booking_date);
        }
        if (booking.return_date) {
            booking.return_date = new Date(booking.return_date);
        }
        const updatedBooking = await (0, booking_service_1.getBookingByIdService)(id);
        if (!updatedBooking === null) {
            return c.text("Booking not found", 404);
        }
        const result = await (0, booking_service_1.updateBookingService)(id, booking);
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.updateBooking = updateBooking;
const deleteBooking = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id))
            return c.text("Invalid id", 400);
        const booking = await (0, booking_service_1.getBookingByIdService)(id);
        if (!booking) {
            return c.text("Booking not found", 404);
        }
        const result = await (0, booking_service_1.deleteBookingService)(id);
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.deleteBooking = deleteBooking;
const limitBooking = async (c) => {
    try {
        const limit = Number(c.req.query("limit"));
        if (isNaN(limit)) {
            return c.text("Invalid limit", 400);
        }
        const bookings = await (0, booking_service_1.limitBookingService)(limit);
        if (bookings === null || bookings.length === 0) {
            return c.text("No bookings found", 404);
        }
        return c.json(bookings, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.limitBooking = limitBooking;
const bookingWithUser = async (c) => {
    try {
        const bookings = await (0, booking_service_1.bookingWithUserService)();
        if (bookings === null || bookings.length === 0) {
            return c.text("No bookings found", 404);
        }
        return c.json(bookings, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.bookingWithUser = bookingWithUser;
// Check if a booking exists
const checkBooking = async (c) => {
    try {
        const booking = await c.req.json();
        const { vehicleId, start_date, end_date } = booking; // Extract vehicleId, start_date, and end_date from the booking object
        const result = await (0, booking_service_1.checkBookingService)(vehicleId, start_date, end_date); // Pass the required arguments to the checkBookingService function
        if (!result) {
            return c.text("Booking not found", 404);
        }
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.checkBooking = checkBooking;
