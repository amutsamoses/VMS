"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fleetRelations = exports.locationRelations = exports.customerSupportRelations = exports.paymentRelations = exports.bookingRelations = exports.vehicleRelations = exports.vehicleSpecRelations = exports.userBookingsRelations = exports.authRelations = exports.userAuthRelations = exports.FleetManagement = exports.LocationsAndBranches = exports.CustomerSupportTickets = exports.Authentication = exports.Payments = exports.Bookings = exports.Vehicles = exports.VehicleSpecifications = exports.Users = exports.payMentEnum = exports.bookingEnum = exports.roleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Enum Definitions
exports.roleEnum = (0, pg_core_1.pgEnum)("role", ["user", "admin"]);
exports.bookingEnum = (0, pg_core_1.pgEnum)("booking_status", [
    "Pending",
    "Confirmed",
    "Cancelled",
    "Completed",
]);
exports.payMentEnum = (0, pg_core_1.pgEnum)("payment_status", [
    "Pending",
    "Completed",
    "Refunded",
]);
// 1.Users Table
exports.Users = (0, pg_core_1.pgTable)("users", {
    user_id: (0, pg_core_1.serial)("user_id").primaryKey(),
    full_name: (0, pg_core_1.varchar)("full_name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).unique().notNull(),
    contact_phone: (0, pg_core_1.varchar)("contact_phone", { length: 15 }),
    address: (0, pg_core_1.text)("address"),
    role: (0, exports.roleEnum)("role").default("user"),
    Image_url: (0, pg_core_1.varchar)("Image_url", { length: 255 }),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// 2.Vehicle Specifications Table
exports.VehicleSpecifications = (0, pg_core_1.pgTable)("vehicle_specifications", {
    vehicleSpec_id: (0, pg_core_1.serial)("vehicleSpec_id").primaryKey(),
    manufacturer: (0, pg_core_1.varchar)("manufacturer", { length: 255 }).notNull(),
    model: (0, pg_core_1.varchar)("model", { length: 255 }).notNull(),
    year: (0, pg_core_1.integer)("year").notNull(),
    fuel_type: (0, pg_core_1.varchar)("fuel_type", { length: 50 }).notNull(),
    engine_capacity: (0, pg_core_1.varchar)("engine_capacity", { length: 50 }),
    transmission: (0, pg_core_1.varchar)("transmission", { length: 50 }),
    seating_capacity: (0, pg_core_1.integer)("seating_capacity"),
    color: (0, pg_core_1.varchar)("color", { length: 50 }),
    features: (0, pg_core_1.text)("features"),
    image_url: (0, pg_core_1.varchar)("image_url", { length: 255 }),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// 3.Vehicles Table
exports.Vehicles = (0, pg_core_1.pgTable)("vehicles", {
    vehicle_id: (0, pg_core_1.serial)("vehicle_id").primaryKey(),
    vehicleSpec_id: (0, pg_core_1.integer)("vehicleSpec_id").references(() => exports.VehicleSpecifications.vehicleSpec_id, { onDelete: "cascade" }),
    rental_rate: (0, pg_core_1.decimal)("rental_rate").notNull(),
    availability: (0, pg_core_1.boolean)("availability").default(true),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// 4.Bookings Table
exports.Bookings = (0, pg_core_1.pgTable)("bookings", {
    booking_id: (0, pg_core_1.serial)("booking_id").primaryKey(),
    user_id: (0, pg_core_1.integer)("user_id").references(() => exports.Users.user_id, {
        onDelete: "cascade",
    }),
    vehicle_id: (0, pg_core_1.integer)("vehicle_id").references(() => exports.Vehicles.vehicle_id, {
        onDelete: "cascade",
    }),
    location_id: (0, pg_core_1.integer)("location_id").references(() => exports.LocationsAndBranches.location_id, { onDelete: "cascade" }),
    booking_date: (0, pg_core_1.timestamp)("booking_date").notNull(),
    return_date: (0, pg_core_1.timestamp)("return_date").notNull(),
    total_amount: (0, pg_core_1.decimal)("total_amount").notNull(),
    booking_status: (0, exports.bookingEnum)("booking_status").default("Pending"),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// 5.Payments Table
exports.Payments = (0, pg_core_1.pgTable)("payments", {
    payment_id: (0, pg_core_1.serial)("payment_id").primaryKey(),
    booking_id: (0, pg_core_1.integer)("booking_id").references(() => exports.Bookings.booking_id, {
        onDelete: "cascade",
    }),
    amount: (0, pg_core_1.decimal)("amount").notNull(),
    payment_status: (0, exports.payMentEnum)("payment_status").default("Pending"),
    payment_date: (0, pg_core_1.timestamp)("payment_date"),
    payment_method: (0, pg_core_1.varchar)("payment_method", { length: 255 }),
    transaction_id: (0, pg_core_1.varchar)("transaction_id", { length: 255 }),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// 6.Authentication Table
exports.Authentication = (0, pg_core_1.pgTable)("authentication", {
    auth_id: (0, pg_core_1.serial)("auth_id").primaryKey(),
    user_id: (0, pg_core_1.integer)("user_id").references(() => exports.Users.user_id, {
        onDelete: "cascade",
    }),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// 7.Customer Support Tickets Table
exports.CustomerSupportTickets = (0, pg_core_1.pgTable)("customer_support_tickets", {
    ticket_id: (0, pg_core_1.serial)("ticket_id").primaryKey(),
    user_id: (0, pg_core_1.integer)("user_id").references(() => exports.Users.user_id, {
        onDelete: "cascade",
    }),
    subject: (0, pg_core_1.varchar)("subject", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// 8.Locations and Branches Table
exports.LocationsAndBranches = (0, pg_core_1.pgTable)("locations_and_branches", {
    location_id: (0, pg_core_1.serial)("location_id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    address: (0, pg_core_1.text)("address").notNull(),
    contact_phone: (0, pg_core_1.varchar)("contact_phone", { length: 15 }),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// 9.Fleet Management Table
exports.FleetManagement = (0, pg_core_1.pgTable)("fleet_management", {
    fleet_id: (0, pg_core_1.serial)("fleet_id").primaryKey(),
    vehicle_id: (0, pg_core_1.integer)("vehicle_id").references(() => exports.Vehicles.vehicle_id, {
        onDelete: "cascade",
    }),
    acquisition_date: (0, pg_core_1.timestamp)("acquisition_date").notNull(),
    depreciation_rate: (0, pg_core_1.decimal)("depreciation_rate").notNull(),
    current_value: (0, pg_core_1.decimal)("current_value").notNull(),
    maintenance_cost: (0, pg_core_1.decimal)("maintenance_cost").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
///////////////////////// RELATIONS //////////////////////////
exports.userAuthRelations = (0, drizzle_orm_1.relations)(exports.Users, ({ one }) => ({
    auth: one(exports.Authentication, {
        fields: [exports.Users.user_id],
        references: [exports.Authentication.user_id],
    }),
    bookings: one(exports.Bookings, {
        fields: [exports.Users.user_id],
        references: [exports.Bookings.user_id],
    }),
    customer: one(exports.CustomerSupportTickets, {
        fields: [exports.Users.user_id],
        references: [exports.CustomerSupportTickets.user_id],
    }),
}));
exports.authRelations = (0, drizzle_orm_1.relations)(exports.Authentication, ({ one }) => ({
    user: one(exports.Users, {
        fields: [exports.Authentication.user_id],
        references: [exports.Users.user_id],
    }),
}));
exports.userBookingsRelations = (0, drizzle_orm_1.relations)(exports.Users, ({ many }) => ({
    bookings: many(exports.Bookings),
    supportTickets: many(exports.CustomerSupportTickets),
}));
exports.vehicleSpecRelations = (0, drizzle_orm_1.relations)(exports.VehicleSpecifications, ({ one, many }) => ({
    vehicles: many(exports.Vehicles),
    fleet: one(exports.FleetManagement, {
        fields: [exports.VehicleSpecifications.vehicleSpec_id],
        references: [exports.FleetManagement.vehicle_id],
    }),
}));
exports.vehicleRelations = (0, drizzle_orm_1.relations)(exports.Vehicles, ({ one }) => ({
    vehicleSpec: one(exports.VehicleSpecifications, {
        fields: [exports.Vehicles.vehicle_id],
        references: [exports.VehicleSpecifications.vehicleSpec_id],
    }),
    bookings: one(exports.Bookings, {
        fields: [exports.Vehicles.vehicleSpec_id],
        references: [exports.Bookings.vehicle_id],
    }),
    fleet: one(exports.FleetManagement, {
        fields: [exports.Vehicles.vehicle_id],
        references: [exports.FleetManagement.vehicle_id],
    }),
}));
exports.bookingRelations = (0, drizzle_orm_1.relations)(exports.Bookings, ({ one }) => ({
    user: one(exports.Users, {
        fields: [exports.Bookings.user_id],
        references: [exports.Users.user_id],
    }),
    vehicle: one(exports.Vehicles, {
        fields: [exports.Bookings.vehicle_id],
        references: [exports.Vehicles.vehicleSpec_id],
    }),
    location: one(exports.LocationsAndBranches, {
        fields: [exports.Bookings.location_id],
        references: [exports.LocationsAndBranches.location_id],
    }),
    payments: one(exports.Payments, {
        fields: [exports.Bookings.booking_id],
        references: [exports.Payments.booking_id],
    }),
}));
exports.paymentRelations = (0, drizzle_orm_1.relations)(exports.Payments, ({ one }) => ({
    booking: one(exports.Bookings, {
        fields: [exports.Payments.booking_id],
        references: [exports.Bookings.booking_id],
    }),
}));
exports.customerSupportRelations = (0, drizzle_orm_1.relations)(exports.CustomerSupportTickets, ({ one }) => ({
    user: one(exports.Users, {
        fields: [exports.CustomerSupportTickets.user_id],
        references: [exports.Users.user_id],
    }),
}));
exports.locationRelations = (0, drizzle_orm_1.relations)(exports.LocationsAndBranches, ({ many }) => ({
    bookings: many(exports.Bookings),
}));
exports.fleetRelations = (0, drizzle_orm_1.relations)(exports.FleetManagement, ({ one }) => ({
    vehicleSpec: one(exports.VehicleSpecifications, {
        fields: [exports.FleetManagement.vehicle_id],
        references: [exports.VehicleSpecifications.vehicleSpec_id],
    }),
}));
