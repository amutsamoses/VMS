import { Context } from "hono";

import {
  getVehicleSpecsByIdService,
  listVehicleSpecService,
  limitVehicleSpecService,
  createVehicleSpecService,
  updateVehicleSpecService,
  deleteVehicleSpecService,
} from "./vehiclespec.service";

export const listVehicleSpec = async (c: Context) => {
  try {
    const limit = c.req.query("limit")
      ? Number(c.req.query("limit"))
      : undefined;

    const vehicleSpecs = await listVehicleSpecService();
    if (vehicleSpecs === null || vehicleSpecs.length === 0) {
      return c.text("No vehicle specs found", 404);
    }
    return c.json(vehicleSpecs, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const getVehicleSpecById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const vehicleSpecs = await getVehicleSpecsByIdService(id);
    if (vehicleSpecs == null) {
      return c.text("Specification not found", 404);
    }
    return c.json(vehicleSpecs, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const createVehicleSpecs = async (c: Context) => {
  try {
    const vehiclespec = await c.req.json();
    const result = await createVehicleSpecService(vehiclespec);

    if (!result) {
      return c.text("Vehicle Specs not created", 400);
    }
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const updateVehicleSpecs = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid id", 400);
    const Specs = await c.req.json();

    const updatedSpecs = await getVehicleSpecsByIdService(id);

    if (!updatedSpecs === null) {
      return c.text("Specification not found", 404);
    }

    const res = await updateVehicleSpecService(id, Specs);
    return c.json({ message: res }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const deleteVehicleSpecs = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) {
    return c.text("Invalid id", 400);
  }

  try {
    const specs = await getVehicleSpecsByIdService(id);
    if (!specs) {
      return c.text("Specification not found", 404);
    }

    // delete the vehicle specification
    const res = await deleteVehicleSpecService(id);

    return c.json({ message: res }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const limitVehicleSpecs = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));
    if (isNaN(limit)) {
      return c.text("Invalid limit", 400);
    }
    const data = await limitVehicleSpecService(limit);
    if (data == null || data.length == 0) {
      return c.text("no specification found!😶‍🌫️👽", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
