"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = exports.paymentWithBooking = exports.createPaymentIntent = exports.deletePayment = exports.updatePayment = exports.getPaymentByBookingController = exports.createPayment = exports.getPaymentById = exports.limitPayment = exports.listPayment = void 0;
require("dotenv/config");
const pay_service_1 = require("./pay.service");
const db_1 = require("../drizzle/db");
const listPayment = async (c) => {
    try {
        const limit = c.req.query("limit")
            ? Number(c.req.query("limit"))
            : undefined;
        const payment = await (0, pay_service_1.listPaymentService)();
        if (payment === null || payment.length === 0) {
            return c.text("No payment found", 404);
        }
        return c.json(payment, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.listPayment = listPayment;
const limitPayment = async (c) => {
    try {
        const limit = parseInt(c.req.param("limit"));
        if (isNaN(limit)) {
            return c.text("Invalid limit", 400);
        }
        const payment = await (0, pay_service_1.limitPaymentService)(limit);
        if (payment === null || payment.length === 0) {
            return c.text("No payment found", 404);
        }
        return c.json(payment, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.limitPayment = limitPayment;
const getPaymentById = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const payment = await (0, pay_service_1.getPaymentByIdService)(id);
        if (payment == null) {
            return c.text("Payment not found", 404);
        }
        return c.json(payment, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.getPaymentById = getPaymentById;
const createPayment = async (c) => {
    try {
        const payment = await c.req.json();
        //convert payment_date to string
        if (payment.payment_date) {
            payment.payment_date = new Date(payment.payment_date);
        }
        const result = await (0, pay_service_1.createPaymentService)(payment);
        if (!result) {
            return c.text("Payment not created", 400);
        }
        return c.json({ message: result }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.createPayment = createPayment;
const getPaymentByBookingController = async (c) => {
    try {
        const { booking_id } = c.req.param();
        const payment = await (0, pay_service_1.getPaymentByBookingService)(parseInt(booking_id));
        if (!payment) {
            return c.json({ message: "Payment not found" }, 404);
        }
        return c.json(payment, 200);
    }
    catch (error) {
        return c.json({ error: error.message }, 400);
    }
};
exports.getPaymentByBookingController = getPaymentByBookingController;
const updatePayment = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id))
            return c.text("Invalid id", 400);
        const payment = await c.req.json();
        const updatedPayment = await (0, pay_service_1.getPaymentByBookingService)(id);
        if (!updatedPayment === null) {
            return c.json({ massage: "Payment not found" }, 404);
        }
        const result = await (0, pay_service_1.updatePaymentService)(id, payment);
        if (!result) {
            return c.json({ message: "Payment not updated" }, 404);
        }
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.updatePayment = updatePayment;
const deletePayment = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id))
            return c.text("Invalid id", 400);
        const payment = await (0, pay_service_1.getPaymentByBookingService)(id);
        if (!payment) {
            return c.json({ message: "Payment not found" }, 404);
        }
        const result = await (0, pay_service_1.deletePaymentService)(id);
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.deletePayment = deletePayment;
//payment intent
const createPaymentIntent = async (c) => {
    try {
        const payment = await c.req.json();
        const result = await (0, pay_service_1.createPaymentIntentService)(payment);
        if (!result) {
            return c.text("Payment not created", 400);
        }
        return c.json({ message: result }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.createPaymentIntent = createPaymentIntent;
//paymentWithBooking
const paymentWithBooking = async (c) => {
    try {
        const payment = await (0, pay_service_1.paymentWithBookingService)();
        if (payment === null || payment.length === 0) {
            return c.text("No booking with such payment found", 404);
        }
        return c.json(payment, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.paymentWithBooking = paymentWithBooking;
const createCheckoutSession = async (c) => {
    let booking;
    try {
        booking = await c.req.json();
    }
    catch (error) {
        return c.json({ message: "Booking not found" }, 404);
    }
    try {
        if (!booking.booking_id) {
            return c.json({ message: "Booking Id is required" }, 404);
        }
        const line_items = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Car Rental",
                    },
                    unit_amount: Math.round(booking.amount * 100),
                },
                quantity: 1,
            },
        ];
        //checkout session
        const sessionParams = {
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: "http://localhost:3000/api/payment-successful",
            cancel_url: "http://localhost:3000/api/payment-cancel",
        };
        const session = await db_1.stripeClient.checkout.sessions.create(sessionParams);
        console.log(`Checkout Session URL : ${session.url}`);
        const paymentDetails = {
            booking_id: booking.booking_id,
            amount: booking.amount.toString(),
            user_id: booking.user_id,
            payment_date: new Date(),
            payment_method: "card",
            transaction_id: session.id,
        };
        const createPayment = await (0, pay_service_1.createPaymentService)(paymentDetails);
        return c.json({ sessionId: session.id, url: session.url, payment: createPayment }, 200);
    }
    catch (error) {
        return c.json({ message: error.message }, 400);
    }
};
exports.createCheckoutSession = createCheckoutSession;
