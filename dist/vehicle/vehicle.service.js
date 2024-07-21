"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleWithDetailService = exports.deleteVehicleService = exports.updateVehicleService = exports.createVehicleService = exports.getVehicleByIdService = exports.limitVehicleService = exports.listVehicleService = void 0;
const db_1 = require("../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
const listVehicleService = async (limit) => {
    if (limit) {
        return await db_1.default.query.Vehicles.findMany({
            limit: limit,
        });
    }
    return await db_1.default.query.Vehicles.findMany();
};
exports.listVehicleService = listVehicleService;
//limitVehicleService function
const limitVehicleService = async (limit) => {
    return await db_1.default.select().from(schema_1.Vehicles).limit(limit).execute();
};
exports.limitVehicleService = limitVehicleService;
//getVehicleByIdService function
const getVehicleByIdService = async (id) => {
    return await db_1.default.query.Vehicles.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.Vehicles.vehicle_id, id),
    });
};
exports.getVehicleByIdService = getVehicleByIdService;
//createVehicleService function
const createVehicleService = async (vehicles) => {
    const { vehicleSpec_id, availability } = vehicles;
    if (!vehicleSpec_id || !availability) {
        throw new Error("Vehicle Spec ID or Availability is undefined.");
    }
    //check if the vehicleSpec_id and availability exists in the database
    const existingVehicle = await db_1.default
        .select()
        .from(schema_1.Vehicles)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Vehicles.vehicleSpec_id, vehicleSpec_id), (0, drizzle_orm_1.eq)(schema_1.Vehicles.availability, availability)))
        .execute();
    if (existingVehicle) {
        return "A vehicle with this vehicleSpec_id and availability already exists.";
    }
    await db_1.default.insert(schema_1.Vehicles).values(vehicles);
    return "Vehicle created successfully!";
};
exports.createVehicleService = createVehicleService;
//updateVehicleService function
const updateVehicleService = async (id, vehicles) => {
    await db_1.default.update(schema_1.Vehicles).set(vehicles).where((0, drizzle_orm_1.eq)(schema_1.Vehicles.vehicle_id, id));
    return "Vehicle updated successfully!";
};
exports.updateVehicleService = updateVehicleService;
//deleteVehicleService function
const deleteVehicleService = async (id) => {
    await db_1.default.delete(schema_1.Vehicles).where((0, drizzle_orm_1.eq)(schema_1.Vehicles.vehicle_id, id));
    return "Vehicle deleted successfully!";
};
exports.deleteVehicleService = deleteVehicleService;
//vehicle with bookings , fleet and vehicle specifications
const vehicleWithDetailService = async () => {
    return await db_1.default.query.Vehicles.findMany({
        columns: {
            rental_rate: true,
            availability: true,
        },
        with: {
            bookings: {
                columns: {
                    booking_date: true,
                    return_date: true,
                    total_amount: true,
                    booking_status: true,
                },
            },
            vehicleSpec: {
                columns: {
                    vehicleSpec_id: false,
                    created_at: false,
                    updated_at: false,
                },
            },
            fleet: {
                columns: {
                    acquisition_date: true,
                    depreciation_rate: true,
                    current_value: true,
                    maintenance_cost: true,
                    status: true,
                },
            },
        },
    });
};
exports.vehicleWithDetailService = vehicleWithDetailService;
