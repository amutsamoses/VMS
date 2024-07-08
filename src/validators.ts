import { z } from "zod";

export const userSchema = z.object({
  full_name: z.string().max(255),
  email: z.string().email().max(255),
  contact_phone: z.string().max(15),
  address: z.string(),
  role: z.enum(["user", "admin"]),
});

export const vehicleSpecificationSchema = z.object({
  manufacturer: z.string().max(255),
  model: z.string().max(255),
  year: z.number(),
  fuel_type: z.string().max(50),
  engine_capacity: z.string().max(50),
  transmission: z.string().max(50),
  seating_capacity: z.number(),
  color: z.string().max(50),
  features: z.string(),
});

export const vehicleSchema = z.object({
  vehicleSpec_id: z.number(),
  rental_rate: z.number(),
  availability: z.boolean(),
});

export const bookingSchema = z.object({
  user_id: z.number(),
  vehicle_id: z.number(),
  location_id: z.number(),
  return_date: z.number(),
  total_amount: z.number(),
  booking_status: z.enum(["Pending", "Confirmed", "Refunded"]),
});

export const paymentSchema = z.object({});
export const authenticationSchema = z.object({});
export const customerSupportSchema = z.object({});
export const locationBranchSchema = z.object({});
export const FleetManagementSchema = z.object({});
export const registerUserSchema = z.object({
  full_name: z.string().max(255),
  email: z.string().email().max(255),
  contact_phone: z.string().max(15),
  role: z.enum(["user", "admin"]),
});
export const loginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
});
