"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWithBookingService = exports.updatePaymentSessionIdService = exports.getPaymentByBookingService = exports.deletePaymentService = exports.updatePaymentService = exports.createPaymentService = exports.getPaymentByIdService = exports.limitPaymentService = exports.listPaymentService = exports.createPaymentIntentService = void 0;
const db_1 = require("../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
const db_2 = require("../drizzle/db");
// interface TIPayments {
//   booking_id: string;
//   amount: number;
//   payment_method: string;
// }
//creating paymentintent service using stripe and inserting the client_secret into the database
const createPaymentIntentService = async (payment) => {
    if (payment.booking_id === undefined) {
        throw new Error("Booking ID is required");
    }
    try {
        const paymentIntent = await db_2.stripeClient.paymentIntents.create({
            //converting the amount to cents
            amount: Number(payment.amount) * 100,
            currency: "usd",
            metadata: { booking_id: payment.booking_id }, //metadata to store the booking_id
        });
        // Insert the data into payments table in the database
        await db_1.default
            .insert(schema_1.Payments)
            .values({
            booking_id: payment.booking_id,
            amount: payment.amount,
            payment_status: "Pending",
            payment_date: new Date(),
            payment_method: payment.payment_method,
            transaction_id: paymentIntent.id,
        })
            .execute();
        console.log(paymentIntent);
        return {
            message: "Payment Made Successfully",
            client_secret: paymentIntent.client_secret,
        }; //returning the client_secret to the frontend
    }
    catch (error) {
        return error;
    }
};
exports.createPaymentIntentService = createPaymentIntentService;
const listPaymentService = async (limit) => {
    if (limit) {
        return await db_1.default.query.Payments.findMany({
            limit: limit,
        });
    }
    return await db_1.default.query.Payments.findMany();
};
exports.listPaymentService = listPaymentService;
const limitPaymentService = async (limit) => {
    return await db_1.default.select().from(schema_1.Payments).limit(limit).execute();
};
exports.limitPaymentService = limitPaymentService;
const getPaymentByIdService = async (id) => {
    return await db_1.default.query.Payments.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.Payments.payment_id, id),
    });
};
exports.getPaymentByIdService = getPaymentByIdService;
const createPaymentService = async (payment) => {
    const { booking_id, amount, payment_method } = payment;
    if (!booking_id || !amount || !payment_method) {
        throw new Error("Booking ID, Amount, or Payment Method is undefined.");
    }
    //check if the booking_id, amount and payment_method exists in the database
    const existingPayment = await db_1.default
        .select()
        .from(schema_1.Payments)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Payments.booking_id, booking_id), (0, drizzle_orm_1.eq)(schema_1.Payments.amount, amount), (0, drizzle_orm_1.eq)(schema_1.Payments.payment_method, payment_method)))
        .execute();
    if (existingPayment) {
        return "A payment with this booking_id, amount and payment_method already exists.";
    }
    await db_1.default.insert(schema_1.Payments).values(payment);
    return "Payment created successfully!";
};
exports.createPaymentService = createPaymentService;
const updatePaymentService = async (id, payment) => {
    await db_1.default.update(schema_1.Payments).set(payment).where((0, drizzle_orm_1.eq)(schema_1.Payments.payment_id, id));
    return "Payment updated successfully!";
};
exports.updatePaymentService = updatePaymentService;
const deletePaymentService = async (id) => {
    await db_1.default.delete(schema_1.Payments).where((0, drizzle_orm_1.eq)(schema_1.Payments.payment_id, id));
    return "Payment deleted successfully!";
};
exports.deletePaymentService = deletePaymentService;
//getPaymentWithBooking service
const getPaymentByBookingService = async (booking_id) => {
    return await db_1.default.query.Payments.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.Payments.booking_id, booking_id),
    });
};
exports.getPaymentByBookingService = getPaymentByBookingService;
//update payment session id
const updatePaymentSessionIdService = async (session_id) => {
    await db_1.default
        .update(schema_1.Payments)
        .set({ payment_status: "Completed" })
        .where((0, drizzle_orm_1.eq)(schema_1.Payments.transaction_id, session_id))
        .execute();
    return "Payment session updated  successfully";
};
exports.updatePaymentSessionIdService = updatePaymentSessionIdService;
//paymentWithBooking service
const paymentWithBookingService = async () => {
    return await db_1.default.query.Payments.findMany({
        columns: {
            payment_id: false,
            booking_id: false,
        },
        with: {
            booking: {
                columns: {
                    booking_date: true,
                    return_date: true,
                    total_amount: true,
                    booking_status: true,
                },
            },
        },
    });
};
exports.paymentWithBookingService = paymentWithBookingService;
