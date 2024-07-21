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
import { updateVehicleSpecWithVehicleSchema } from "../validators";

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

// controller for creating vehicleSpec with vehicle
export const createVehicleSpecWithVehicle = async (c: Context) => {
  try {
    const vehicleSpec = await c.req.json();
    const vehicle = await c.req.json();

    if (!vehicleSpec || !vehicle) {
      return c.text("Vehicle Specs or vehicle not found", 400);
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
    // Parse and validate the request body
    const body = await c.req.json();
    const { vehicleSpecId, vehicleSpec, vehicle } =
      updateVehicleSpecWithVehicleSchema.parse(body);

    // Convert features to a single string or null if it's an empty array
    const features =
      (vehicleSpec.features ?? []).length > 0
        ? vehicleSpec.features.join(", ")
        : null;

    // Update the vehicleSpec object with the modified features property
    const updatedVehicleSpec = {
      ...vehicleSpec,
      features,
    };

    // Update the rental_rate property to be of type string
    const updatedVehicle = {
      ...vehicle,
      rental_rate: vehicle.rental_rate?.toString() ?? "",
    };

    // Call the service to update the vehicle and its specifications
    const result = await updateVehicleSpecServiceWithVehicleService(
      updatedVehicleSpec,
      updatedVehicle,
      vehicleSpecId // Pass the vehicleSpecId as a separate argument
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

// controller for deleting vehicleSpec with vehicle
export const deleteVehicleSpecWithVehicle = async (c: Context) => {
  try {
    // Get the vehicle specification ID from the request parameters
    const vehicleSpecId = Number(c.req.param("id"));

    // Check if the vehicleSpec_id is a valid number
    if (isNaN(vehicleSpecId)) {
      return c.json({ error: "Invalid vehicle specification ID" }, 400);
    }

    // Call the delete service
    const message =
      await deleteVehicleSpecServiceWithVehicleService(vehicleSpecId);

    // Return success message
    return c.json({ message }, 200);
  } catch (error: any) {
    // Return error message
    return c.json({ error: error.message }, 500);
  }
};
