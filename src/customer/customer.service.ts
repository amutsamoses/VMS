import db from "../drizzle/db";
import { eq } from "drizzle-orm";

import {
  CustomerSupportTickets,
  TICustomerSupportTickets,
  TSCustomerSupportTickets,
} from "../drizzle/schema";

export const listCustomerSupportTicketsService = async (
  limit?: number
): Promise<TSCustomerSupportTickets[] | null> => {
  if (limit) {
    return await db.query.CustomerSupportTickets.findMany({
      limit: limit,
    });
  }
  return await db.query.CustomerSupportTickets.findMany();
};

export const limitCustomerSupportTicketsService = async (
  limit: number
): Promise<TSCustomerSupportTickets[] | null> => {
  return await db.select().from(CustomerSupportTickets).limit(limit).execute();
};

export const getCustomerSupportTicketsByIdService = async (
  id: number
): Promise<TSCustomerSupportTickets | undefined> => {
  return await db.query.CustomerSupportTickets.findFirst({
    where: eq(CustomerSupportTickets.ticket_id, id),
  });
};

export const createCustomerSupportTicketsService = async (
  customerSupportTickets: TICustomerSupportTickets
) => {
  await db.insert(CustomerSupportTickets).values(customerSupportTickets);
  return "Customer Support Ticket created successfully!";
};

export const updateCustomerSupportTicketsService = async (
  id: number,
  customerSupportTickets: TICustomerSupportTickets
) => {
  await db
    .update(CustomerSupportTickets)
    .set(customerSupportTickets)
    .where(eq(CustomerSupportTickets.ticket_id, id));
  return "Customer Support Ticket updated successfully!";
};

export const deleteCustomerSupportTicketsService = async (id: number) => {
  await db
    .delete(CustomerSupportTickets)
    .where(eq(CustomerSupportTickets.ticket_id, id));
  return "Customer Support Ticket deleted successfully!";
};
