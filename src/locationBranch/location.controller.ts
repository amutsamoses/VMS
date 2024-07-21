import { Context } from "hono";

import {
  listLocationsAndBranchesService,
  getLocationsAndBranchesByIdService,
  createLocationsAndBranchesService,
  updateLocationsAndBranchesService,
  deleteLocationsAndBranchesService,
  limitLocationsAndBranchesService,
  locationWithBookingsService,
} from "./location.service";

export const listLocationsBranches = async (c: Context) => {
  try {
    const limit = c.req.query("limit")
      ? Number(c.req.query("limit"))
      : undefined;

    const locationsBranches = await listLocationsAndBranchesService();
    if (locationsBranches === null || locationsBranches.length === 0) {
      return c.text("No location and branches found", 404);
    }
    return c.json(locationsBranches, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const getLocationsAndBranchesById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const locationsBranches = await getLocationsAndBranchesByIdService(id);
    if (locationsBranches == null) {
      return c.text("Location and Branch not found", 404);
    }
    return c.json(locationsBranches, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const createLocationsAndBranches = async (c: Context) => {
  try {
    const locationsAndBranches = await c.req.json();
    const result =
      await createLocationsAndBranchesService(locationsAndBranches);

    if (!result) {
      return c.text("Location and Branch not created", 400);
    }
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const updateLocationsAndBranches = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);
    const locationsAndBranches = await c.req.json();

    const updatedLocationsAndBranches =
      await getLocationsAndBranchesByIdService(id);

    if (!updatedLocationsAndBranches === null) {
      return c.text("Location and Branch not found", 404);
    }

    const result = await updateLocationsAndBranchesService(
      id,
      locationsAndBranches
    );

    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const deleteLocationsAndBranches = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);

    const locationsAndBranches = await getLocationsAndBranchesByIdService(id);

    if (!locationsAndBranches) {
      return c.text("Location and Branch not found", 404);
    }

    const result = await deleteLocationsAndBranchesService(id);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const limitLocationsAndBranches = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));

    const locationsAndBranches = await limitLocationsAndBranchesService(limit);
    if (locationsAndBranches === null || locationsAndBranches.length === 0) {
      return c.text("No location and branches found", 404);
    }
    return c.json(locationsAndBranches, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};


//location with bookings
export const locationWithBookings = async (c: Context) => {
  try {
    const locations = await locationWithBookingsService(c);
    if (locations === null || locations.length === 0) {
      return c.text("No locations found", 404);
    }
    return c.json(locations, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};