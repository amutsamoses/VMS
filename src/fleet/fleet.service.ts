import db from "../drizzle/db";
import { eq } from "drizzle-orm";

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

export const createFleetService = async (fleet: TIFleetManagement) => {
  await db.insert(FleetManagement).values(fleet);
  return "Fleet created successfully!";
};

export const updateFleetService = async (
  id: number,
  fleet: TIFleetManagement
) => {
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
