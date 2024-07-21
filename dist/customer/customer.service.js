"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerSupportTicketsWithUserService = exports.deleteCustomerSupportTicketsService = exports.updateCustomerSupportTicketsService = exports.createCustomerSupportTicketsService = exports.getCustomerSupportTicketsByIdService = exports.limitCustomerSupportTicketsService = exports.listCustomerSupportTicketsService = void 0;
const db_1 = require("../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
const listCustomerSupportTicketsService = async (limit) => {
    if (limit) {
        return await db_1.default.query.CustomerSupportTickets.findMany({
            limit: limit,
        });
    }
    return await db_1.default.query.CustomerSupportTickets.findMany();
};
exports.listCustomerSupportTicketsService = listCustomerSupportTicketsService;
const limitCustomerSupportTicketsService = async (limit) => {
    return await db_1.default.select().from(schema_1.CustomerSupportTickets).limit(limit).execute();
};
exports.limitCustomerSupportTicketsService = limitCustomerSupportTicketsService;
const getCustomerSupportTicketsByIdService = async (id) => {
    return await db_1.default.query.CustomerSupportTickets.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.CustomerSupportTickets.ticket_id, id),
    });
};
exports.getCustomerSupportTicketsByIdService = getCustomerSupportTicketsByIdService;
const createCustomerSupportTicketsService = async (customerSupportTickets) => {
    const { user_id, subject } = customerSupportTickets;
    if (!user_id || !subject) {
        throw new Error("User ID or Subject is undefined.");
    }
    // Check if a ticket already exists with the same user_id and subject
    const existingTicket = await db_1.default
        .select()
        .from(schema_1.CustomerSupportTickets)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.CustomerSupportTickets.user_id, user_id), (0, drizzle_orm_1.eq)(schema_1.CustomerSupportTickets.subject, subject)))
        .execute();
    if (existingTicket) {
        return "A customer support ticket with this user and subject already exists.";
    }
    // Insert the new ticket
    await db_1.default.insert(schema_1.CustomerSupportTickets).values(customerSupportTickets);
    return "Customer Support Ticket created successfully!";
};
exports.createCustomerSupportTicketsService = createCustomerSupportTicketsService;
const updateCustomerSupportTicketsService = async (id, customerSupportTickets) => {
    try {
        // Update the customer support ticket
        const result = await db_1.default
            .update(schema_1.CustomerSupportTickets)
            .set(customerSupportTickets)
            .where((0, drizzle_orm_1.eq)(schema_1.CustomerSupportTickets.ticket_id, id))
            .execute();
        if (!result === null) {
            throw new Error("Customer Support Ticket not found.");
        }
        return "Customer Support Ticket updated successfully!";
    }
    catch (error) {
        // Handle any errors that occur during the update
        return Promise.reject(`Failed to update Customer Support Ticket: ${error.message}`);
    }
};
exports.updateCustomerSupportTicketsService = updateCustomerSupportTicketsService;
const deleteCustomerSupportTicketsService = async (id) => {
    await db_1.default
        .delete(schema_1.CustomerSupportTickets)
        .where((0, drizzle_orm_1.eq)(schema_1.CustomerSupportTickets.ticket_id, id));
    return "Customer Support Ticket deleted successfully!";
};
exports.deleteCustomerSupportTicketsService = deleteCustomerSupportTicketsService;
//customerSupportTickets with user
const customerSupportTicketsWithUserService = async () => {
    return await db_1.default.query.CustomerSupportTickets.findMany({
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
exports.customerSupportTicketsWithUserService = customerSupportTicketsWithUserService;
