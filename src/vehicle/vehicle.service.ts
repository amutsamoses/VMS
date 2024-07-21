import db from "../drizzle/db";
import { eq, and } from "drizzle-orm";
import { Vehicles, TIVehicles, TSVehicles } from "../drizzle/schema";

export const listVehicleService = async (
  limit?: number
): Promise<TSVehicles[] | null> => {
  if (limit) {
    return await db.query.Vehicles.findMany({
      limit: limit,
    });
  }
  return await db.query.Vehicles.findMany();
};

//limitVehicleService function
export const limitVehicleService = async (
  limit: number
): Promise<TSVehicles[] | null> => {
  return await db.select().from(Vehicles).limit(limit).execute();
};

//getVehicleByIdService function
export const getVehicleByIdService = async (
  id: number
): Promise<TSVehicles | undefined> => {
  return await db.query.Vehicles.findFirst({
    where: eq(Vehicles.vehicle_id, id),
  });
};

//createVehicleService function
export const createVehicleService = async (
  vehicles: TIVehicles
): Promise<string> => {
  const { vehicleSpec_id, availability } = vehicles;

  if (!vehicleSpec_id || !availability) {
    throw new Error("Vehicle Spec ID or Availability is undefined.");
  }

  //check if the vehicleSpec_id and availability exists in the database
  const existingVehicle = await db
    .select()
    .from(Vehicles)
    .where(
      and(
        eq(Vehicles.vehicleSpec_id, vehicleSpec_id),
        eq(Vehicles.availability, availability)
      )
    )
    .execute();

  if (existingVehicle) {
    return "A vehicle with this vehicleSpec_id and availability already exists.";
  }
  await db.insert(Vehicles).values(vehicles);
  return "Vehicle created successfully!";
};

//updateVehicleService function
export const updateVehicleService = async (
  id: number,
  vehicles: TIVehicles
): Promise<string> => {
  await db.update(Vehicles).set(vehicles).where(eq(Vehicles.vehicle_id, id));
  return "Vehicle updated successfully!";
};

//deleteVehicleService function
export const deleteVehicleService = async (id: number): Promise<string> => {
  await db.delete(Vehicles).where(eq(Vehicles.vehicle_id, id));
  return "Vehicle deleted successfully!";
};

//vehicle with bookings , fleet and vehicle specifications
export const vehicleWithDetailService = async () => {
  return await db.query.Vehicles.findMany({
    columns: {
      rental_rate: true,
      availability: true,
    },
    with: {
      bookings: {
        columns: {
          booking_date: true,
          return_date: true,
          total_amount: true,
          booking_status: true,
        },
      },
      vehicleSpec: {
        columns: {
          vehicleSpec_id: false,
          created_at: false,
          updated_at: false,
        },
      },
      fleet: {
        columns: {
          acquisition_date: true,
          depreciation_rate: true,
          current_value: true,
          maintenance_cost: true,
          status: true,
        },
      },
    },
  });
};
