import db from "../drizzle/db";
import { eq, and } from "drizzle-orm";
import { Payments, TIPayments, TSPayments } from "../drizzle/schema";
import { stripeClient } from "../drizzle/db";
import { Session } from "inspector";

// interface TIPayments {
//   booking_id: string;
//   amount: number;
//   payment_method: string;
// }
//creating paymentintent service using stripe and inserting the client_secret into the database
export const createPaymentIntentService = async (payment: TIPayments) => {
  if (payment.booking_id === undefined) {
    throw new Error("Booking ID is required");
  }

  try {
    const paymentIntent = await stripeClient.paymentIntents.create({
      //converting the amount to cents
      amount: Number(payment.amount) * 100,
      currency: "usd",
      metadata: { booking_id: payment.booking_id }, //metadata to store the booking_id
    });

    // Insert the data into payments table in the database
    await db
      .insert(Payments)
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
  } catch (error) {
    return error;
  }
};

export const listPaymentService = async (
  limit?: number
): Promise<TSPayments[] | null> => {
  if (limit) {
    return await db.query.Payments.findMany({
      limit: limit,
    });
  }
  return await db.query.Payments.findMany();
};

export const limitPaymentService = async (
  limit: number
): Promise<TSPayments[] | null> => {
  return await db.select().from(Payments).limit(limit).execute();
};

export const getPaymentByIdService = async (
  id: number
): Promise<TSPayments | undefined> => {
  return await db.query.Payments.findFirst({
    where: eq(Payments.payment_id, id),
  });
};

export const createPaymentService = async (
  payment: TIPayments
): Promise<string> => {
  const { booking_id, amount, payment_method } = payment;

  if (!booking_id || !amount || !payment_method) {
    throw new Error("Booking ID, Amount, or Payment Method is undefined.");
  }
  //check if the booking_id, amount and payment_method exists in the database
  const existingPayment = await db
    .select()
    .from(Payments)
    .where(
      and(
        eq(Payments.booking_id, booking_id),
        eq(Payments.amount, amount),
        eq(Payments.payment_method, payment_method)
      )
    )
    .execute();

  if (existingPayment) {
    return "A payment with this booking_id, amount and payment_method already exists.";
  }

  await db.insert(Payments).values(payment);
  return "Payment created successfully!";
};

export const updatePaymentService = async (id: number, payment: TIPayments) => {
  await db.update(Payments).set(payment).where(eq(Payments.payment_id, id));
  return "Payment updated successfully!";
};

export const deletePaymentService = async (id: number) => {
  await db.delete(Payments).where(eq(Payments.payment_id, id));
  return "Payment deleted successfully!";
};

//getPaymentWithBooking service
export const getPaymentByBookingService = async (booking_id: number) => {
  return await db.query.Payments.findFirst({
    where: eq(Payments.booking_id, booking_id),
  });
};

//update payment session id
export const updatePaymentSessionIdService = async (session_id: string) => {
  await db
    .update(Payments)
    .set({ payment_status: "Completed" })
    .where(eq(Payments.transaction_id, session_id))
    .execute();
  return "Payment session updated  successfully";
};

//paymentWithBooking service
export const paymentWithBookingService = async () => {
  return await db.query.Payments.findMany({
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
