import { Context } from "hono";

import {
  getVehicleByIdService,
  listVehicleService,
  limitVehicleService,
  createVehicleService,
  updateVehicleService,
  deleteVehicleService,
  vehicleWithDetailService,
} from "./vehicle.service";

export const listVehicle = async (c: Context) => {
  try {
    const limit = c.req.query("limit")
      ? Number(c.req.query("limit"))
      : undefined;

    const vehicles = await listVehicleService();
    if (vehicles === null || vehicles.length === 0) {
      return c.text("No vehicles found", 404);
    }
    return c.json(vehicles, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const getVehicleById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const vehicle = await getVehicleByIdService(id);
    if (vehicle == null) {
      return c.text("Vehicle not found", 404);
    }
    return c.json(vehicle, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const createVehicle = async (c: Context) => {
  try {
    const vehicle = await c.req.json();
    const result = await createVehicleService(vehicle);

    if (!result) {
      return c.text("Vehicle not created", 400);
    }
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const updateVehicle = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const vehicle = await c.req.json();

    //search by id
    const vehicleById = await getVehicleByIdService(id);
    if (!vehicleById) {
      return c.text("Vehicle not updated", 400);
    }
    const result = await updateVehicleService(id, vehicle);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const deleteVehicle = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const vehicle = await deleteVehicleService(id);
    if (!vehicle) {
      return c.text("Vehicle not deleted", 400);
    }

    //delete vehicle
    const result = await getVehicleByIdService(id);

    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

//limitVehicle function
export const limitVehicle = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));
    if (isNaN(limit)) {
      return c.text("Invalid limit", 400);
    }

    const vehicles = await limitVehicleService(limit);
    if (vehicles === null || vehicles.length === 0) {
      return c.text("No vehicles found", 404);
    }
    return c.json(vehicles, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const vehicleWithDetail = async (c: Context) => {
  try {
    const vehicles = await vehicleWithDetailService();
    if (vehicles === null || vehicles.length === 0) {
      return c.text("No vehicles found", 404);
    }
    return c.json(vehicles, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};