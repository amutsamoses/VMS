import db from "../drizzle/db";
import { eq } from "drizzle-orm";

import {
  TIVehicleSpecifications,
  TSVehicleSpecifications,
  VehicleSpecifications,
} from "../drizzle/schema";

export const listVehicleSpecService = async (
  limit?: number
): Promise<TSVehicleSpecifications[] | null> => {
  if (limit) {
    return await db.query.VehicleSpecifications.findMany({
      limit: limit,
    });
  }
  return await db.query.VehicleSpecifications.findMany();
};

export const limitVehicleSpecService = async (
  limit: number
): Promise<TSVehicleSpecifications[] | null> => {
  return await db.select().from(VehicleSpecifications).limit(limit).execute();
};

export const getVehicleSpecsByIdService = async (
  id: number
): Promise<TSVehicleSpecifications | undefined> => {
  return await db.query.VehicleSpecifications.findFirst({
    where: eq(VehicleSpecifications.vehicleSpec_id, id),
  });
};

export const createVehicleSpecService = async (
  vehicleSpecs: TIVehicleSpecifications
) => {
  await db.insert(VehicleSpecifications).values(vehicleSpecs);
  return "Vehicle Specs created successfully!";
};

export const updateVehicleSpecService = async (
  id: number,
  vehicleSpecs: TIVehicleSpecifications
) => {
  await db
    .update(VehicleSpecifications)
    .set(vehicleSpecs)
    .where(eq(VehicleSpecifications.vehicleSpec_id, id));
  return "Vehicle Specs updated successfully!";
};

export const deleteVehicleSpecService = async (id: number) => {
  await db
    .delete(VehicleSpecifications)
    .where(eq(VehicleSpecifications.vehicleSpec_id, id));
  return "Vehicle Specs deleted successfully!";
};
