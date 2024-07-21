import db from "../drizzle/db";
import { eq, and } from "drizzle-orm";

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
): Promise<string> => {
  const { user_id, subject } = customerSupportTickets;

  if (!user_id || !subject) {
    throw new Error("User ID or Subject is undefined.");
  }

  // Check if a ticket already exists with the same user_id and subject
  const existingTicket = await db
    .select()
    .from(CustomerSupportTickets)
    .where(
      and(
        eq(CustomerSupportTickets.user_id, user_id),
        eq(CustomerSupportTickets.subject, subject)
      )
    )
    .execute();

  if (existingTicket) {
    return "A customer support ticket with this user and subject already exists.";
  }

  // Insert the new ticket
  await db.insert(CustomerSupportTickets).values(customerSupportTickets);
  return "Customer Support Ticket created successfully!";
};

export const updateCustomerSupportTicketsService = async (
  id: number,
  customerSupportTickets: TICustomerSupportTickets
): Promise<string> => {
  try {
    // Update the customer support ticket
    const result = await db
      .update(CustomerSupportTickets)
      .set(customerSupportTickets)
      .where(eq(CustomerSupportTickets.ticket_id, id))
      .execute();

    if (!result === null) {
      throw new Error("Customer Support Ticket not found.");
    }

    return "Customer Support Ticket updated successfully!";
  } catch (error: any) {
    // Handle any errors that occur during the update
    return Promise.reject(
      `Failed to update Customer Support Ticket: ${error.message}`
    );
  }
};

export const deleteCustomerSupportTicketsService = async (id: number) => {
  await db
    .delete(CustomerSupportTickets)
    .where(eq(CustomerSupportTickets.ticket_id, id));
  return "Customer Support Ticket deleted successfully!";
};

//customerSupportTickets with user
export const customerSupportTicketsWithUserService = async (): Promise<
  TSCustomerSupportTickets | any
> => {
  return await db.query.CustomerSupportTickets.findMany({
    columns: {
      subject: true,
      description: true,
      status: true,
    },
    with: {
      user: {
        columns: {
          full_name: true,
          email: true,
          contact_phone: true,
          address: true,
        },
      },
    },
  });
};
