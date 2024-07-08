import db from "../drizzle/db";
import { eq } from "drizzle-orm";
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
export const createVehicleService = async (vehicles: TIVehicles) => {
  await db.insert(Vehicles).values(vehicles);
  return "Vehicle created successfully!";
};

//updateVehicleService function
export const updateVehicleService = async (
  id: number,
  vehicles: TIVehicles
) => {
  await db.update(Vehicles).set(vehicles).where(eq(Vehicles.vehicle_id, id));
  return "Vehicle updated successfully!";
};

//deleteVehicleService function
export const deleteVehicleService = async (id: number) => {
  await db.delete(Vehicles).where(eq(Vehicles.vehicle_id, id));
  return "Vehicle deleted successfully!";
};
