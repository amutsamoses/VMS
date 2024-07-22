import { z } from "zod";

const bookingStatusEnum = z.enum([
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
]);

export const userSchema = z.object({
  user_id: z.number().int().optional(),
  full_name: z.string().max(255),
  email: z.string().email().max(255),
  contact_phone: z.string().max(15).nullable(),
  address: z.string(),
  role: z.enum(["user", "admin"]).default("user"),
});

export const registerUserSchema = z.object({
  auth_id: z.number().int().optional(),
  user_id: z.number().int().optional(),
  password: z.string().max(255),
});
export const loginUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().max(255),
});

export const vehicleSpecificationSchema = z.object({
  manufacturer: z.string().max(255),
  model: z.string().max(255),
  year: z.number(),
  fuel_type: z.string().max(50),
  engine_capacity: z.string().max(50).optional(),
  transmission: z.string().max(50).optional(),
  seating_capacity: z.number(),
  color: z.string().max(50),
  features: z.array(z.string()).optional(),
  image_url: z.string().optional(),
});

export const vehicleSchema = z.object({
  vehicleSpec_id: z.number().optional(),
  rental_rate: z.number(),
  availability: z.boolean(),
});

// Define the schema for the update request
export const updateVehicleSpecWithVehicleSchema = z.object({
  vehicleSpecId: z.number(),
  vehicleSpec: vehicleSpecificationSchema.partial(), // Allow partial updates
  vehicle: vehicleSchema.partial(), // Allow partial updates
});

export const bookingSchema = z.object({
  user_id: z.number(),
  vehicle_id: z.number(),
  location_id: z.number(),
  booking_date: z.string(),
  return_date: z.string(),
  total_amount: z.number(),
  booking_status: bookingStatusEnum.default("Pending").optional(),
});

export const locationBranchSchema = z.object({});

export const customerSupportSchema = z.object({
  user_id: z.number(),
  subject: z.string(),
  description: z.string(),
  status: z.string(),
});

export const FleetManagementSchema = z.object({});

export const paymentSchema = z.object({
  booking_id: z.number(),
  amount: z.number(),
  payment_status: z.string(),
  payment_date: z.string(),
  payment_method: z.string(),
  transction_id: z.string(),
});
