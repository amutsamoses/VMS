"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleWithDetail = exports.limitVehicle = exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicleById = exports.listVehicle = void 0;
const vehicle_service_1 = require("./vehicle.service");
const listVehicle = async (c) => {
    try {
        const limit = c.req.query("limit")
            ? Number(c.req.query("limit"))
            : undefined;
        const vehicles = await (0, vehicle_service_1.listVehicleService)();
        if (vehicles === null || vehicles.length === 0) {
            return c.text("No vehicles found", 404);
        }
        return c.json(vehicles, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.listVehicle = listVehicle;
const getVehicleById = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const vehicle = await (0, vehicle_service_1.getVehicleByIdService)(id);
        if (vehicle == null) {
            return c.text("Vehicle not found", 404);
        }
        return c.json(vehicle, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.getVehicleById = getVehicleById;
const createVehicle = async (c) => {
    try {
        const vehicle = await c.req.json();
        const result = await (0, vehicle_service_1.createVehicleService)(vehicle);
        if (!result) {
            return c.text("Vehicle not created", 400);
        }
        return c.json({ message: result }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.createVehicle = createVehicle;
const updateVehicle = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const vehicle = await c.req.json();
        //search by id
        const vehicleById = await (0, vehicle_service_1.getVehicleByIdService)(id);
        if (!vehicleById) {
            return c.text("Vehicle not updated", 400);
        }
        const result = await (0, vehicle_service_1.updateVehicleService)(id, vehicle);
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const vehicle = await (0, vehicle_service_1.deleteVehicleService)(id);
        if (!vehicle) {
            return c.text("Vehicle not deleted", 400);
        }
        //delete vehicle
        const result = await (0, vehicle_service_1.getVehicleByIdService)(id);
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.deleteVehicle = deleteVehicle;
//limitVehicle function
const limitVehicle = async (c) => {
    try {
        const limit = Number(c.req.query("limit"));
        if (isNaN(limit)) {
            return c.text("Invalid limit", 400);
        }
        const vehicles = await (0, vehicle_service_1.limitVehicleService)(limit);
        if (vehicles === null || vehicles.length === 0) {
            return c.text("No vehicles found", 404);
        }
        return c.json(vehicles, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.limitVehicle = limitVehicle;
const vehicleWithDetail = async (c) => {
    try {
        const vehicles = await (0, vehicle_service_1.vehicleWithDetailService)();
        if (vehicles === null || vehicles.length === 0) {
            return c.text("No vehicles found", 404);
        }
        return c.json(vehicles, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.vehicleWithDetail = vehicleWithDetail;
