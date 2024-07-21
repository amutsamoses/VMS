"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fleetWithVehicleService = exports.deleteFleetService = exports.updateFleetService = exports.createFleetService = exports.getFleetByIdService = exports.limitFleetService = exports.listFleetService = void 0;
const db_1 = require("../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
const listFleetService = async (limit) => {
    if (limit) {
        return await db_1.default.query.FleetManagement.findMany({
            limit: limit,
        });
    }
    return await db_1.default.query.FleetManagement.findMany();
};
exports.listFleetService = listFleetService;
const limitFleetService = async (limit) => {
    return await db_1.default.select().from(schema_1.FleetManagement).limit(limit).execute();
};
exports.limitFleetService = limitFleetService;
const getFleetByIdService = async (id) => {
    return await db_1.default.query.FleetManagement.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.FleetManagement.fleet_id, id),
    });
};
exports.getFleetByIdService = getFleetByIdService;
const createFleetService = async (fleet) => {
    const { fleet_id, vehicle_id } = fleet;
    if (!fleet_id || !vehicle_id) {
        throw new Error("Fleet ID or Vehicle ID is undefined.");
    }
    //check if the fleet_id and vehicle_id exists in the database
    const existingFleet = await db_1.default
        .select()
        .from(schema_1.FleetManagement)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.FleetManagement.fleet_id, fleet_id), (0, drizzle_orm_1.eq)(schema_1.FleetManagement.vehicle_id, vehicle_id)))
        .execute();
    if (existingFleet) {
        return "A fleet with this fleet_id and vehicle_id already exists.";
    }
    await db_1.default.insert(schema_1.FleetManagement).values(fleet);
    return "Fleet created successfully!";
};
exports.createFleetService = createFleetService;
const updateFleetService = async (id, fleet) => {
    await db_1.default
        .update(schema_1.FleetManagement)
        .set(fleet)
        .where((0, drizzle_orm_1.eq)(schema_1.FleetManagement.fleet_id, id));
    return "Fleet updated successfully!";
};
exports.updateFleetService = updateFleetService;
const deleteFleetService = async (id) => {
    await db_1.default.delete(schema_1.FleetManagement).where((0, drizzle_orm_1.eq)(schema_1.FleetManagement.fleet_id, id));
    return "Fleet deleted successfully!";
};
exports.deleteFleetService = deleteFleetService;
//fleet with vehicle
const fleetWithVehicleService = async () => {
    return await db_1.default.query.FleetManagement.findMany({
        columns: {
            acquisition_date: true,
            depreciation_rate: true,
            current_value: true,
            maintenance_cost: true,
            status: true,
        },
        with: {
            vehicleSpec: {
                columns: {
                    vehicleSpec_id: false,
                    created_at: false,
                    updated_at: false,
                },
            },
        },
    });
};
exports.fleetWithVehicleService = fleetWithVehicleService;
