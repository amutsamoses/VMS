import { Context } from "hono";
import "dotenv/config";
import {
  listPaymentService,
  limitPaymentService,
  getPaymentByIdService,
  createPaymentService,
  updatePaymentService,
  deletePaymentService,
  getPaymentByBookingService,
  createPaymentIntentService,
  updatePaymentSessionIdService,
  paymentWithBookingService,
} from "./pay.service";
import { stripeClient } from "../drizzle/db";
import Stripe from "stripe";

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
    //convert payment_date to string
    if (payment.payment_date) {
      payment.payment_date = new Date(payment.payment_date);
    }

    const result = await createPaymentService(payment);

    if (!result) {
      return c.text("Payment not created", 400);
    }
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const getPaymentByBookingController = async (c: Context) => {
  try {
    const { booking_id } = c.req.param();
    const payment = await getPaymentByBookingService(parseInt(booking_id));
    if (!payment) {
      return c.json({ message: "Payment not found" }, 404);
    }
    return c.json(payment, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

export const updatePayment = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);
    const payment = await c.req.json();

    const updatedPayment = await getPaymentByBookingService(id);

    if (!updatedPayment === null) {
      return c.json({ massage: "Payment not found" }, 404);
    }

    const result = await updatePaymentService(id, payment);

    if (!result) {
      return c.json({ message: "Payment not updated" }, 404);
    }

    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const deletePayment = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);

    const payment = await getPaymentByBookingService(id);

    if (!payment) {
      return c.json({ message: "Payment not found" }, 404);
    }

    const result = await deletePaymentService(id);

    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

//payment intent
export const createPaymentIntent = async (c: Context) => {
  try {
    const payment = await c.req.json();
    const result = await createPaymentIntentService(payment);

    if (!result) {
      return c.text("Payment not created", 400);
    }
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

//paymentWithBooking
export const paymentWithBooking = async (c: Context) => {
  try {
    const payment = await paymentWithBookingService();
    if (payment === null || payment.length === 0) {
      return c.text("No booking with such payment found", 404);
    }
    return c.json(payment, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const createCheckoutSession = async (c: Context) => {
  let booking;
  try {
    booking = await c.req.json();
  } catch (error: any) {
    return c.json({ message: "Booking not found" }, 404);
  }

  try {
    if (!booking.booking_id) {
      return c.json({ message: "Booking Id is required" }, 404);
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
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
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:3000/api/payment-successful",
      cancel_url: "http://localhost:3000/api/payment-cancel",
    };

    const session: Stripe.Checkout.Session =
      await stripeClient.checkout.sessions.create(sessionParams);
    console.log(`Checkout Session URL : ${session.url}`);

    const paymentDetails = {
      booking_id: booking.booking_id,
      amount: booking.amount.toString(),
      user_id: booking.user_id,
      payment_date: new Date(),
      payment_method: "card",
      transaction_id: session.id,
    };

    const createPayment = await createPaymentService(paymentDetails);
    return c.json(
      { sessionId: session.id, url: session.url, payment: createPayment },
      200
    );
  } catch (error: any) {
    return c.json({ message: error.message }, 400);
  }
};
