import { Context } from "hono";

import {
  listFleetService,
  getFleetByIdService,
  createFleetService,
  updateFleetService,
  deleteFleetService,
  limitFleetService,
} from "./fleet.service";

export const listFleet = async (c: Context) => {
  try {
    const limit = c.req.query("limit")
      ? Number(c.req.query("limit"))
      : undefined;

    const fleet = await listFleetService();
    if (fleet === null || fleet.length === 0) {
      return c.text("No fleet found", 404);
    }
    return c.json(fleet, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const getFleetById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const fleet = await getFleetByIdService(id);
    if (fleet == null) {
      return c.text("Fleet not found", 404);
    }
    return c.json(fleet, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const createFleet = async (c: Context) => {
  try {
    const fleet = await c.req.json();
    const result = await createFleetService(fleet);

    if (!result) {
      return c.text("Fleet not created", 400);
    }
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const updateFleet = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);
    const fleet = await c.req.json();

    const updatedFleet = await getFleetByIdService(id);

    if (!updatedFleet === null) {
      return c.text("Fleet not found", 404);
    }

    const res = await updateFleetService(id, fleet);
    return c.json({ message: res }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const deleteFleet = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);

    const fleet = await getFleetByIdService(id);

    if (!fleet) {
      return c.text("Fleet not found", 404);
    }

    const res = await deleteFleetService(id);
    return c.json({ message: res }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const limitFleet = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));

    const fleet = await limitFleetService(limit);
    if (fleet === null || fleet.length === 0) {
      return c.text("No fleet found", 404);
    }
    return c.json(fleet, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};
