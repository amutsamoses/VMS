"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fleetWithVehicle = exports.limitFleet = exports.deleteFleet = exports.updateFleet = exports.createFleet = exports.getFleetById = exports.listFleet = void 0;
const fleet_service_1 = require("./fleet.service");
const listFleet = async (c) => {
    try {
        const limit = c.req.query("limit")
            ? Number(c.req.query("limit"))
            : undefined;
        const fleet = await (0, fleet_service_1.listFleetService)();
        if (fleet === null || fleet.length === 0) {
            return c.text("No fleet found", 404);
        }
        return c.json(fleet, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.listFleet = listFleet;
const getFleetById = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const fleet = await (0, fleet_service_1.getFleetByIdService)(id);
        if (fleet == null) {
            return c.text("Fleet not found", 404);
        }
        return c.json(fleet, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.getFleetById = getFleetById;
const createFleet = async (c) => {
    try {
        const fleet = await c.req.json();
        // convert acquisition_date to string
        //convert booking_date and return_date to string
        if (fleet.acquisition_date) {
            fleet.acquisition_date = new Date(fleet.acquisition_date);
        }
        if (fleet.acquisition_date) {
            fleet.acquisition_date = new Date(fleet.acquisition_date);
        }
        const result = await (0, fleet_service_1.createFleetService)(fleet);
        if (!result) {
            return c.text("Fleet not created", 400);
        }
        return c.json({ message: result }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.createFleet = createFleet;
const updateFleet = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id))
            return c.text("Invalid id", 400);
        const fleet = await c.req.json();
        const updatedFleet = await (0, fleet_service_1.getFleetByIdService)(id);
        if (!updatedFleet === null) {
            return c.text("Fleet not found", 404);
        }
        const res = await (0, fleet_service_1.updateFleetService)(id, fleet);
        return c.json({ message: res }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.updateFleet = updateFleet;
const deleteFleet = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id))
            return c.text("Invalid id", 400);
        const fleet = await (0, fleet_service_1.getFleetByIdService)(id);
        if (!fleet) {
            return c.text("Fleet not found", 404);
        }
        const res = await (0, fleet_service_1.deleteFleetService)(id);
        return c.json({ message: res }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.deleteFleet = deleteFleet;
const limitFleet = async (c) => {
    try {
        const limit = Number(c.req.query("limit"));
        const fleet = await (0, fleet_service_1.limitFleetService)(limit);
        if (fleet === null || fleet.length === 0) {
            return c.text("No fleet found", 404);
        }
        return c.json(fleet, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.limitFleet = limitFleet;
//fleet with vehicle
const fleetWithVehicle = async (c) => {
    try {
        const fleet = await (0, fleet_service_1.fleetWithVehicleService)();
        if (fleet === null || fleet.length === 0) {
            return c.text("No fleet found", 404);
        }
        return c.json(fleet, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.fleetWithVehicle = fleetWithVehicle;
