"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerSupportTicketsWithUser = exports.limitCustomerSupportTickets = exports.deleteCustomerSupportTickets = exports.updateCustomerSupportTickets = exports.createCustomerSupportTickets = exports.getCustomerSupportTicketsById = exports.listCustomerSupportTickets = void 0;
const customer_service_1 = require("./customer.service");
const listCustomerSupportTickets = async (c) => {
    try {
        const limit = c.req.query("limit")
            ? Number(c.req.query("limit"))
            : undefined;
        const customerSupportTickets = await (0, customer_service_1.listCustomerSupportTicketsService)();
        if (customerSupportTickets === null ||
            customerSupportTickets.length === 0) {
            return c.text("No customer support tickets found", 404);
        }
        return c.json(customerSupportTickets, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.listCustomerSupportTickets = listCustomerSupportTickets;
const getCustomerSupportTicketsById = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const customerSupportTickets = await (0, customer_service_1.getCustomerSupportTicketsByIdService)(id);
        if (customerSupportTickets == null) {
            return c.text("Customer Support Ticket not found", 404);
        }
        return c.json(customerSupportTickets, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.getCustomerSupportTicketsById = getCustomerSupportTicketsById;
const createCustomerSupportTickets = async (c) => {
    try {
        const customerSupportTickets = await c.req.json();
        const result = await (0, customer_service_1.createCustomerSupportTicketsService)(customerSupportTickets);
        if (!result) {
            return c.text("Customer Support Ticket not created", 400);
        }
        return c.json({ message: result }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.createCustomerSupportTickets = createCustomerSupportTickets;
const updateCustomerSupportTickets = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id))
            return c.text("Invalid id", 400);
        const customerSupportTickets = await c.req.json();
        const updatedCustomerSupportTickets = await (0, customer_service_1.getCustomerSupportTicketsByIdService)(id);
        if (!updatedCustomerSupportTickets === null) {
            return c.text("Customer Support Ticket not found", 404);
        }
        const result = await (0, customer_service_1.updateCustomerSupportTicketsService)(id, customerSupportTickets);
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.updateCustomerSupportTickets = updateCustomerSupportTickets;
const deleteCustomerSupportTickets = async (c) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
        return c.text("Invalid id", 400);
    }
    try {
        const ticket = await (0, customer_service_1.deleteCustomerSupportTicketsService)(id);
        if (!ticket) {
            return c.text("Customer Support Ticket not deleted", 400);
        }
        const result = await (0, customer_service_1.deleteCustomerSupportTicketsService)(id);
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.deleteCustomerSupportTickets = deleteCustomerSupportTickets;
const limitCustomerSupportTickets = async (c) => {
    try {
        const limit = Number(c.req.query("limit"));
        const customerSupportTickets = await (0, customer_service_1.limitCustomerSupportTicketsService)(limit);
        if (customerSupportTickets === null ||
            customerSupportTickets.length === 0) {
            return c.text("No customer support tickets found", 404);
        }
        return c.json(customerSupportTickets, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.limitCustomerSupportTickets = limitCustomerSupportTickets;
// customer with user
const customerSupportTicketsWithUser = async (c) => {
    try {
        const customerSupportTickets = await (0, customer_service_1.customerSupportTicketsWithUserService)();
        if (customerSupportTickets === null ||
            customerSupportTickets.length === 0) {
            return c.text("No customer support tickets found", 404);
        }
        return c.json(customerSupportTickets, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.customerSupportTicketsWithUser = customerSupportTicketsWithUser;
