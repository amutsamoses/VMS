"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationWithBookings = exports.limitLocationsAndBranches = exports.deleteLocationsAndBranches = exports.updateLocationsAndBranches = exports.createLocationsAndBranches = exports.getLocationsAndBranchesById = exports.listLocationsBranches = void 0;
const location_service_1 = require("./location.service");
const listLocationsBranches = async (c) => {
    try {
        const limit = c.req.query("limit")
            ? Number(c.req.query("limit"))
            : undefined;
        const locationsBranches = await (0, location_service_1.listLocationsAndBranchesService)();
        if (locationsBranches === null || locationsBranches.length === 0) {
            return c.text("No location and branches found", 404);
        }
        return c.json(locationsBranches, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.listLocationsBranches = listLocationsBranches;
const getLocationsAndBranchesById = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const locationsBranches = await (0, location_service_1.getLocationsAndBranchesByIdService)(id);
        if (locationsBranches == null) {
            return c.text("Location and Branch not found", 404);
        }
        return c.json(locationsBranches, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.getLocationsAndBranchesById = getLocationsAndBranchesById;
const createLocationsAndBranches = async (c) => {
    try {
        const locationsAndBranches = await c.req.json();
        const result = await (0, location_service_1.createLocationsAndBranchesService)(locationsAndBranches);
        if (!result) {
            return c.text("Location and Branch not created", 400);
        }
        return c.json({ message: result }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.createLocationsAndBranches = createLocationsAndBranches;
const updateLocationsAndBranches = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id))
            return c.text("Invalid id", 400);
        const locationsAndBranches = await c.req.json();
        const updatedLocationsAndBranches = await (0, location_service_1.getLocationsAndBranchesByIdService)(id);
        if (!updatedLocationsAndBranches === null) {
            return c.text("Location and Branch not found", 404);
        }
        const result = await (0, location_service_1.updateLocationsAndBranchesService)(id, locationsAndBranches);
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.updateLocationsAndBranches = updateLocationsAndBranches;
const deleteLocationsAndBranches = async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id))
            return c.text("Invalid id", 400);
        const locationsAndBranches = await (0, location_service_1.getLocationsAndBranchesByIdService)(id);
        if (!locationsAndBranches) {
            return c.text("Location and Branch not found", 404);
        }
        const result = await (0, location_service_1.deleteLocationsAndBranchesService)(id);
        return c.json({ message: result }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.deleteLocationsAndBranches = deleteLocationsAndBranches;
const limitLocationsAndBranches = async (c) => {
    try {
        const limit = Number(c.req.query("limit"));
        const locationsAndBranches = await (0, location_service_1.limitLocationsAndBranchesService)(limit);
        if (locationsAndBranches === null || locationsAndBranches.length === 0) {
            return c.text("No location and branches found", 404);
        }
        return c.json(locationsAndBranches, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.limitLocationsAndBranches = limitLocationsAndBranches;
//location with bookings
const locationWithBookings = async (c) => {
    try {
        const locations = await (0, location_service_1.locationWithBookingsService)(c);
        if (locations === null || locations.length === 0) {
            return c.text("No locations found", 404);
        }
        return c.json(locations, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 500);
    }
};
exports.locationWithBookings = locationWithBookings;
