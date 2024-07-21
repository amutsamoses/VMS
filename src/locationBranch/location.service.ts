import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { Context } from "hono"

import {
  LocationsAndBranches,
  TILocationsAndBranches,
  TSLocationsAndBranches,
} from "../drizzle/schema";

export const listLocationsAndBranchesService = async (
  limit?: number
): Promise<TSLocationsAndBranches[] | null> => {
  if (limit) {
    return await db.query.LocationsAndBranches.findMany({
      limit: limit,
    });
  }
  return await db.query.LocationsAndBranches.findMany();
};

export const limitLocationsAndBranchesService = async (
  limit: number
): Promise<TSLocationsAndBranches[] | null> => {
  return await db.select().from(LocationsAndBranches).limit(limit).execute();
};

export const getLocationsAndBranchesByIdService = async (
  id: number
): Promise<TSLocationsAndBranches | undefined> => {
  return await db.query.LocationsAndBranches.findFirst({
    where: eq(LocationsAndBranches.location_id, id),
  });
}

export const createLocationsAndBranchesService = async (
  locationsAndBranches: TILocationsAndBranches
) => {
  await db.insert(LocationsAndBranches).values(locationsAndBranches);
  return "Location and Branch created successfully!";
};

export const updateLocationsAndBranchesService = async (
  id: number,
  locationsAndBranches: TILocationsAndBranches
) => {
  await db
    .update(LocationsAndBranches)
    .set(locationsAndBranches)
    .where(eq(LocationsAndBranches.location_id, id));
  return "Location and Branch updated successfully!";
};

export const deleteLocationsAndBranchesService = async (id: number) => {
  await db
    .delete(LocationsAndBranches)
    .where(eq(LocationsAndBranches.location_id, id));
  return "Location and Branch deleted successfully!";
};


//location with bookings
export const locationWithBookingsService = async (c: Context) => {
  return await db.query.LocationsAndBranches.findMany({
    columns: {
      name: true,
      address: true,
      contact_phone: true,
    },
    with: {
      bookings: {
        columns: {
          booking_date: true,
          return_date: true,
          total_amount: true,
          booking_status: true,
        }
      }
    }
  });
}