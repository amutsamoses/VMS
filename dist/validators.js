"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = exports.FleetManagementSchema = exports.customerSupportSchema = exports.locationBranchSchema = exports.bookingSchema = exports.updateVehicleSpecWithVehicleSchema = exports.vehicleSchema = exports.vehicleSpecificationSchema = exports.loginUserSchema = exports.registerUserSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
const bookingStatusEnum = zod_1.z.enum([
    "Pending",
    "Confirmed",
    "Cancelled",
    "Completed",
]);
exports.userSchema = zod_1.z.object({
    user_id: zod_1.z.number().int().optional(),
    full_name: zod_1.z.string().max(255),
    email: zod_1.z.string().email().max(255),
    contact_phone: zod_1.z.string().max(15).nullable(),
    address: zod_1.z.string(),
    role: zod_1.z.enum(["user", "admin"]).default("user"),
});
exports.registerUserSchema = zod_1.z.object({
    auth_id: zod_1.z.number().int().optional(),
    user_id: zod_1.z.number().int().optional(),
    password: zod_1.z.string().max(255),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(255),
    password: zod_1.z.string().max(255),
});
exports.vehicleSpecificationSchema = zod_1.z.object({
    manufacturer: zod_1.z.string().max(255),
    model: zod_1.z.string().max(255),
    year: zod_1.z.number(),
    fuel_type: zod_1.z.string().max(50),
    engine_capacity: zod_1.z.string().max(50),
    transmission: zod_1.z.string().max(50),
    seating_capacity: zod_1.z.number(),
    color: zod_1.z.string().max(50),
    features: zod_1.z.array(zod_1.z.string()).optional(),
    image_url: zod_1.z.string().max(255),
});
exports.vehicleSchema = zod_1.z.object({
    vehicleSpec_id: zod_1.z.number(),
    rental_rate: zod_1.z.number(),
    availability: zod_1.z.boolean(),
});
// Define the schema for the update request
exports.updateVehicleSpecWithVehicleSchema = zod_1.z.object({
    vehicleSpecId: zod_1.z.number(),
    vehicleSpec: exports.vehicleSpecificationSchema.partial(), // Allow partial updates
    vehicle: exports.vehicleSchema.partial(), // Allow partial updates
});
exports.bookingSchema = zod_1.z.object({
    user_id: zod_1.z.number(),
    vehicle_id: zod_1.z.number(),
    location_id: zod_1.z.number(),
    booking_date: zod_1.z.string(),
    return_date: zod_1.z.string(),
    total_amount: zod_1.z.number(),
    booking_status: bookingStatusEnum.default("Pending").optional(),
});
exports.locationBranchSchema = zod_1.z.object({});
exports.customerSupportSchema = zod_1.z.object({
    user_id: zod_1.z.number(),
    subject: zod_1.z.string(),
    description: zod_1.z.string(),
    status: zod_1.z.string(),
});
exports.FleetManagementSchema = zod_1.z.object({});
exports.paymentSchema = zod_1.z.object({
    booking_id: zod_1.z.number(),
    amount: zod_1.z.number(),
    payment_status: zod_1.z.string(),
    payment_date: zod_1.z.string(),
    payment_method: zod_1.z.string(),
    transction_id: zod_1.z.string(),
});
