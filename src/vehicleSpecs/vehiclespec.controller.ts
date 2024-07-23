import { Context } from "hono";

import {
  getVehicleSpecsByIdService,
  listVehicleSpecService,
  limitVehicleSpecService,
  createVehicleSpecService,
  updateVehicleSpecService,
  deleteVehicleSpecService,
  vehicleSpecWithVehicleService,
  createVehicleSpecServiceWithVehicleService,
  updateVehicleSpecServiceWithVehicleService,
  deleteVehicleSpecServiceWithVehicleService,
} from "./vehiclespec.service";
import { z, ZodError } from "zod";
import { vehicleSchema, vehicleSpecificationSchema } from "../validators";
import { TIVehicleSpecifications, TIVehicles } from "../drizzle/schema";

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

// vehicleSpec with vehicle
export const vehicleSpecWithVehicle = async (c: Context) => {
  try {
    const vehicleSpecs = await vehicleSpecWithVehicleService(); // Remove the argument

    if (vehicleSpecs === null || vehicleSpecs.length === 0) {
      return c.text("No vehicle specs found", 404);
    }
    return c.json(vehicleSpecs, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const createVehicleSpecWithVehicle = async (c: Context) => {
  try {
    const { vehicleSpec, vehicle } = await c.req.json();

    if (!vehicleSpec || !vehicle) {
      return c.text("Vehicle Specs or vehicle not found", 400);
    }

    // Validate the vehicleSpec object
    try {
      vehicleSpecificationSchema.parse(vehicleSpec);
    } catch (err: any) {
      return c.json({ error: err.errors }, 400);
    }

    // Validate the vehicle object
    try {
      vehicleSchema.parse(vehicle);
    } catch (err: any) {
      return c.json({ error: err.errors }, 400);
    }
    console.log("Request Data", vehicleSpec, vehicle);

    const result = await createVehicleSpecServiceWithVehicleService(
      vehicleSpec,
      vehicle
    ); // Pass both vehicleSpec and vehicle to the function

    if (!result) {
      return c.text("Vehicle Specs with vehicles not found", 400);
    }
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

export const updateVehicleSpecWithVehicle = async (c: Context) => {
  try {
    console.log("Request Params:", c.req.param("vehicleSpecId"));
    const body = await c.req.json();
    console.log("Request Body:", body);

    const vehicleSpec: Partial<TIVehicleSpecifications> = body.vehicleSpec;
    const vehicle: Partial<TIVehicles> = body.vehicle;
    const vehicleSpecId: number = parseInt(c.req.param("vehicleSpecId"), 10);

    console.log("Parsed vehicleSpecId:", vehicleSpecId);

    const result = await updateVehicleSpecServiceWithVehicleService(
      vehicleSpec,
      vehicle,
      vehicleSpecId
    );

    // Return the success response
    return c.json({ message: result }, 200);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return c.json({ error: error.errors }, 400);
    }
    // Return other errors
    return c.json({ error: error?.message }, 500);
  }
};

export const deleteVehicleSpecWithVehicle = async (c: Context) => {
  try {
    const vehicleSpecId = c.req.param("vehicleSpecId");

    if (!vehicleSpecId) {
      return c.text("Vehicle specification ID is required", 400);
    }

    const result = await deleteVehicleSpecServiceWithVehicleService(
      Number(vehicleSpecId)
    );

    return c.json({ message: result }, 200);
  } catch (error: any) {
    console.error("Error:", error); // Log detailed error
    return c.json({ error: error?.message || "An error occurred" }, 500);
  }
};
