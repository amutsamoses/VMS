import db from "../drizzle/db";
import { eq, and } from "drizzle-orm";

import {
  FleetManagement,
  TIFleetManagement,
  TSFleetManagement,
} from "../drizzle/schema";

export const listFleetService = async (
  limit?: number
): Promise<TSFleetManagement[] | null> => {
  if (limit) {
    return await db.query.FleetManagement.findMany({
      limit: limit,
    });
  }
  return await db.query.FleetManagement.findMany();
};

export const limitFleetService = async (
  limit: number
): Promise<TSFleetManagement[] | null> => {
  return await db.select().from(FleetManagement).limit(limit).execute();
};

export const getFleetByIdService = async (
  id: number
): Promise<TSFleetManagement | undefined> => {
  return await db.query.FleetManagement.findFirst({
    where: eq(FleetManagement.fleet_id, id),
  });
};

export const createFleetService = async (
  fleet: TIFleetManagement
): Promise<string> => {
  const { fleet_id, vehicle_id } = fleet;

  if (!fleet_id || !vehicle_id) {
    throw new Error("Fleet ID or Vehicle ID is undefined.");
  }

  //check if the fleet_id and vehicle_id exists in the database
  const existingFleet = await db
    .select()
    .from(FleetManagement)
    .where(
      and(
        eq(FleetManagement.fleet_id, fleet_id),
        eq(FleetManagement.vehicle_id, vehicle_id)
      )
    )
    .execute();

  if (existingFleet) {
    return "A fleet with this fleet_id and vehicle_id already exists.";
  }

  await db.insert(FleetManagement).values(fleet);
  return "Fleet created successfully!";
};

export const updateFleetService = async (
  id: number,
  fleet: TIFleetManagement
): Promise<string> => {
  await db
    .update(FleetManagement)
    .set(fleet)
    .where(eq(FleetManagement.fleet_id, id));
  return "Fleet updated successfully!";
};

export const deleteFleetService = async (id: number) => {
  await db.delete(FleetManagement).where(eq(FleetManagement.fleet_id, id));
  return "Fleet deleted successfully!";
};

//fleet with vehicle
export const fleetWithVehicleService = async () => {
  return await db.query.FleetManagement.findMany({
    columns: {
      acquisition_date: true,
      depreciation_rate: true,
      current_value: true,
      maintenance_cost: true,
      status: true,
    },
    with: {
      vehicleSpec: {
        columns: {
          vehicleSpec_id: false,
          created_at: false,
          updated_at: false,
        },
      },
    },
  });
};
