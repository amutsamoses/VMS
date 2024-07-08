import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { Payments, TIPayments, TSPayments } from "../drizzle/schema";

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

export const createPaymentService = async (payment: TIPayments) => {
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
