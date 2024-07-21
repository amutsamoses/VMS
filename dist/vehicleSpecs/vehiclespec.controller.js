"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicleSpecWithVehicle = exports.updateVehicleSpecWithVehicle = exports.createVehicleSpecWithVehicle = exports.vehicleSpecWithVehicle = exports.limitVehicleSpecs = exports.deleteVehicleSpecs = exports.updateVehicleSpecs = exports.createVehicleSpecs = exports.getVehicleSpecById = exports.listVehicleSpec = void 0;
const vehiclespec_service_1 = require("./vehiclespec.service");
const zod_1 = require("zod");
const validators_1 = require("../validators");
const listVehicleSpec = async (c) => {
    try {
        const limit = c.req.query("limit")
            ? Number(c.req.query("limit"))
            : undefined;
        const vehicleSpecs = await (0, vehiclespec_service_1.listVehicleSpecService)();
        if (vehicleSpecs === null || vehicleSpecs.length === 0) {
            return c.text("No vehicle specs found", 404);
        }
        return c.json(vehicleSpecs, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.listVehicleSpec = listVehicleSpec;
const getVehicleSpecById = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const vehicleSpecs = await (0, vehiclespec_service_1.getVehicleSpecsByIdService)(id);
        if (vehicleSpecs == null) {
            return c.text("Specification not found", 404);
        }
        return c.json(vehicleSpecs, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.getVehicleSpecById = getVehicleSpecById;
const createVehicleSpecs = async (c) => {
    try {
        const vehiclespec = await c.req.json();
        const result = await (0, vehiclespec_service_1.createVehicleSpecService)(vehiclespec);
        if (!result) {
            return c.text("Vehicle Specs not created", 400);
        }
        return c.json({ message: result }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.createVehicleSpecs = createVehicleSpecs;
const updateVehicleSpecs = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id))
            return c.text("Invalid id", 400);
        const Specs = await c.req.json();
        const updatedSpecs = await (0, vehiclespec_service_1.getVehicleSpecsByIdService)(id);
        if (!updatedSpecs === null) {
            return c.text("Specification not found", 404);
        }
        const res = await (0, vehiclespec_service_1.updateVehicleSpecService)(id, Specs);
        return c.json({ message: res }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.updateVehicleSpecs = updateVehicleSpecs;
const deleteVehicleSpecs = async (c) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
        return c.text("Invalid id", 400);
    }
    try {
        const specs = await (0, vehiclespec_service_1.getVehicleSpecsByIdService)(id);
        if (!specs) {
            return c.text("Specification not found", 404);
        }
        // delete the vehicle specification
        const res = await (0, vehiclespec_service_1.deleteVehicleSpecService)(id);
        return c.json({ message: res }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.deleteVehicleSpecs = deleteVehicleSpecs;
const limitVehicleSpecs = async (c) => {
    try {
        const limit = Number(c.req.query("limit"));
        if (isNaN(limit)) {
            return c.text("Invalid limit", 400);
        }
        const data = await (0, vehiclespec_service_1.limitVehicleSpecService)(limit);
        if (data == null || data.length == 0) {
            return c.text("no specification found!😶‍🌫️👽", 404);
        }
        return c.json(data, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.limitVehicleSpecs = limitVehicleSpecs;
// vehicleSpec with vehicle
const vehicleSpecWithVehicle = async (c) => {
    try {
        const vehicleSpecs = await (0, vehiclespec_service_1.vehicleSpecWithVehicleService)(); // Remove the argument
        if (vehicleSpecs === null || vehicleSpecs.length === 0) {
            return c.text("No vehicle specs found", 404);
        }
        return c.json(vehicleSpecs, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.vehicleSpecWithVehicle = vehicleSpecWithVehicle;
// controller for creating vehicleSpec with vehicle
const createVehicleSpecWithVehicle = async (c) => {
    try {
        const vehicleSpec = await c.req.json();
        const vehicle = await c.req.json();
        if (!vehicleSpec || !vehicle) {
            return c.text("Vehicle Specs or vehicle not found", 400);
        }
        console.log("Request Data", vehicleSpec, vehicle);
        const result = await (0, vehiclespec_service_1.createVehicleSpecServiceWithVehicleService)(vehicleSpec, vehicle); // Pass both vehicleSpec and vehicle to the function
        if (!result) {
            return c.text("Vehicle Specs with vehicles not found", 400);
        }
        return c.json({ message: result }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.createVehicleSpecWithVehicle = createVehicleSpecWithVehicle;
const updateVehicleSpecWithVehicle = async (c) => {
    try {
        // Parse and validate the request body
        const body = await c.req.json();
        const { vehicleSpecId, vehicleSpec, vehicle } = validators_1.updateVehicleSpecWithVehicleSchema.parse(body);
        // Convert features to a single string or null if it's an empty array
        const features = (vehicleSpec.features ?? []).length > 0
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
        const result = await (0, vehiclespec_service_1.updateVehicleSpecServiceWithVehicleService)(updatedVehicleSpec, updatedVehicle, vehicleSpecId // Pass the vehicleSpecId as a separate argument
        );
        // Return the success response
        return c.json({ message: result }, 200);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // Return validation errors
            return c.json({ error: error.errors }, 400);
        }
        // Return other errors
        return c.json({ error: error?.message }, 500);
    }
};
exports.updateVehicleSpecWithVehicle = updateVehicleSpecWithVehicle;
// controller for deleting vehicleSpec with vehicle
const deleteVehicleSpecWithVehicle = async (c) => {
    try {
        // Get the vehicle specification ID from the request parameters
        const vehicleSpecId = Number(c.req.param("id"));
        // Check if the vehicleSpec_id is a valid number
        if (isNaN(vehicleSpecId)) {
            return c.json({ error: "Invalid vehicle specification ID" }, 400);
        }
        // Call the delete service
        const message = await (0, vehiclespec_service_1.deleteVehicleSpecServiceWithVehicleService)(vehicleSpecId);
        // Return success message
        return c.json({ message }, 200);
    }
    catch (error) {
        // Return error message
        return c.json({ error: error.message }, 500);
    }
};
exports.deleteVehicleSpecWithVehicle = deleteVehicleSpecWithVehicle;
