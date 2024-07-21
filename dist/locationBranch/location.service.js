"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationWithBookingsService = exports.deleteLocationsAndBranchesService = exports.updateLocationsAndBranchesService = exports.createLocationsAndBranchesService = exports.getLocationsAndBranchesByIdService = exports.limitLocationsAndBranchesService = exports.listLocationsAndBranchesService = void 0;
const db_1 = require("../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
const listLocationsAndBranchesService = async (limit) => {
    if (limit) {
        return await db_1.default.query.LocationsAndBranches.findMany({
            limit: limit,
        });
    }
    return await db_1.default.query.LocationsAndBranches.findMany();
};
exports.listLocationsAndBranchesService = listLocationsAndBranchesService;
const limitLocationsAndBranchesService = async (limit) => {
    return await db_1.default.select().from(schema_1.LocationsAndBranches).limit(limit).execute();
};
exports.limitLocationsAndBranchesService = limitLocationsAndBranchesService;
const getLocationsAndBranchesByIdService = async (id) => {
    return await db_1.default.query.LocationsAndBranches.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.LocationsAndBranches.location_id, id),
    });
};
exports.getLocationsAndBranchesByIdService = getLocationsAndBranchesByIdService;
const createLocationsAndBranchesService = async (locationsAndBranches) => {
    await db_1.default.insert(schema_1.LocationsAndBranches).values(locationsAndBranches);
    return "Location and Branch created successfully!";
};
exports.createLocationsAndBranchesService = createLocationsAndBranchesService;
const updateLocationsAndBranchesService = async (id, locationsAndBranches) => {
    await db_1.default
        .update(schema_1.LocationsAndBranches)
        .set(locationsAndBranches)
        .where((0, drizzle_orm_1.eq)(schema_1.LocationsAndBranches.location_id, id));
    return "Location and Branch updated successfully!";
};
exports.updateLocationsAndBranchesService = updateLocationsAndBranchesService;
const deleteLocationsAndBranchesService = async (id) => {
    await db_1.default
        .delete(schema_1.LocationsAndBranches)
        .where((0, drizzle_orm_1.eq)(schema_1.LocationsAndBranches.location_id, id));
    return "Location and Branch deleted successfully!";
};
exports.deleteLocationsAndBranchesService = deleteLocationsAndBranchesService;
//location with bookings
const locationWithBookingsService = async (c) => {
    return await db_1.default.query.LocationsAndBranches.findMany({
        columns: {
            name: true,
            address: true,
            contact_phone: true,
        },
        with: {
            bookings: {
                columns: {
                    booking_date: true,
                    return_date: true,
                    total_amount: true,
                    booking_status: true,
                }
            }
        }
    });
};
exports.locationWithBookingsService = locationWithBookingsService;
