"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicleSpecServiceWithVehicleService = exports.updateVehicleSpecServiceWithVehicleService = exports.createVehicleSpecServiceWithVehicleService = exports.vehicleSpecWithVehicleByIdService = exports.vehicleSpecWithVehicleService = exports.deleteVehicleSpecService = exports.updateVehicleSpecService = exports.createVehicleSpecService = exports.getVehicleSpecsByIdService = exports.limitVehicleSpecService = exports.listVehicleSpecService = void 0;
const db_1 = require("../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
const validators_1 = require("../validators");
const listVehicleSpecService = async (limit) => {
    if (limit) {
        return await db_1.default.query.VehicleSpecifications.findMany({
            limit: limit,
        });
    }
    return await db_1.default.query.VehicleSpecifications.findMany();
};
exports.listVehicleSpecService = listVehicleSpecService;
const limitVehicleSpecService = async (limit) => {
    return await db_1.default.select().from(schema_1.VehicleSpecifications).limit(limit).execute();
};
exports.limitVehicleSpecService = limitVehicleSpecService;
const getVehicleSpecsByIdService = async (id) => {
    return await db_1.default.query.VehicleSpecifications.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.VehicleSpecifications.vehicleSpec_id, id),
    });
};
exports.getVehicleSpecsByIdService = getVehicleSpecsByIdService;
const createVehicleSpecService = async (vehicleSpecs) => {
    await db_1.default.insert(schema_1.VehicleSpecifications).values(vehicleSpecs);
    return "Vehicle Specs created successfully!";
};
exports.createVehicleSpecService = createVehicleSpecService;
const updateVehicleSpecService = async (id, vehicleSpecs) => {
    await db_1.default
        .update(schema_1.VehicleSpecifications)
        .set(vehicleSpecs)
        .where((0, drizzle_orm_1.eq)(schema_1.VehicleSpecifications.vehicleSpec_id, id));
    return "Vehicle Specs updated successfully!";
};
exports.updateVehicleSpecService = updateVehicleSpecService;
const deleteVehicleSpecService = async (id) => {
    await db_1.default
        .delete(schema_1.VehicleSpecifications)
        .where((0, drizzle_orm_1.eq)(schema_1.VehicleSpecifications.vehicleSpec_id, id));
    return "Vehicle Specs deleted successfully!";
};
exports.deleteVehicleSpecService = deleteVehicleSpecService;
//vehicleSpec with with vehicle
const vehicleSpecWithVehicleService = async () => {
    const vehiclespecs = await db_1.default.query.VehicleSpecifications.findMany({
        columns: {
            created_at: false,
            updated_at: false,
        },
        with: {
            vehicles: {
                columns: {
                    vehicle_id: true,
                    vehicleSpec_id: true,
                    rental_rate: true,
                    availability: true,
                },
            },
        },
    });
    return vehiclespecs.map((spec) => {
        //one to one relationship
        const vehicle = spec.vehicles[0];
        if (!vehicle) {
            return {
                vehicleSpec_id: spec.vehicleSpec_id,
                manufacturer: spec.manufacturer,
                model: spec.model,
                year: spec.year,
                fuel_type: spec.fuel_type,
                engine_capacity: spec.engine_capacity ?? "",
                transmission: spec.transmission ?? "",
                seating_capacity: spec.seating_capacity ?? 0,
                color: spec.color ?? "",
                features: Array.isArray(spec.features) ? spec.features : [],
                image_url: spec.image_url ?? "",
            };
        }
        return {
            vehicleSpec_id: spec.vehicleSpec_id,
            manufacturer: spec.manufacturer,
            model: spec.model,
            year: spec.year,
            fuel_type: spec.fuel_type,
            engine_capacity: spec.engine_capacity ?? "",
            transmission: spec.transmission ?? "",
            seating_capacity: spec.seating_capacity ?? 0,
            color: spec.color ?? "",
            features: Array.isArray(spec.features) ? spec.features : [],
            image_url: spec.image_url ?? "",
            vehicle_id: vehicle.vehicle_id,
            rental_rate: vehicle.rental_rate,
            availability: vehicle.availability,
        };
    });
};
exports.vehicleSpecWithVehicleService = vehicleSpecWithVehicleService;
//get vehicleSpec with vehicle by id
const vehicleSpecWithVehicleByIdService = async (vehicleid) => {
    const result = await db_1.default.query.VehicleSpecifications.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.VehicleSpecifications.vehicleSpec_id, vehicleid),
        columns: {
            vehicleSpec_id: false,
            created_at: false,
            updated_at: false,
        },
        with: {
            vehicles: {
                columns: {
                    vehicleSpec_id: true,
                    rental_rate: true,
                    availability: true,
                },
            },
        },
    });
    if (result.length === 0) {
        throw new Error("Vehicle Spec not found");
    }
    const vehicleSpec = result[0];
    // Transform the result to match TVehicleSpecification interface
    return {
        manufacturer: vehicleSpec.manufacturer,
        model: vehicleSpec.model,
        year: vehicleSpec.year,
        fuel_type: vehicleSpec.fuel_type,
        engine_capacity: vehicleSpec.engine_capacity ?? "",
        transmission: vehicleSpec.transmission ?? "",
        seating_capacity: vehicleSpec.seating_capacity ?? 0,
        color: vehicleSpec.color ?? "",
        features: Array.isArray(vehicleSpec.features) ? vehicleSpec.features : [],
        image_url: vehicleSpec.image_url ?? "",
    };
};
exports.vehicleSpecWithVehicleByIdService = vehicleSpecWithVehicleByIdService;
// createVehicleSpecServiceWithVehicleService is a service that
//creates a new vehicle specification and a vehicle in a single transaction.
// This service is useful when you want to create a new vehicle specification and a vehicle at the same time.
const createVehicleSpecServiceWithVehicleService = async (vehicleSpec, vehicle) => {
    //console.log("vehicleSpec", vehicleSpec); to debug and check the vehicleSpec object
    console.log("VehicleSpec", vehicleSpec);
    console.log("Vehicle", vehicle);
    // Validate the vehicleSpec object
    validators_1.vehicleSpecificationSchema.parse(vehicleSpec);
    // Validate the vehicle object
    validators_1.vehicleSchema.parse(vehicle);
    //check if the vehicle already exists
    const existingVehicle = await db_1.default
        .select()
        .from(schema_1.Vehicles)
        .where((0, drizzle_orm_1.eq)(schema_1.Vehicles.vehicleSpec_id, vehicle.vehicleSpec_id ?? 0))
        .execute();
    if (existingVehicle.length > 0) {
        throw new Error("Vehicle already exists");
    }
    // Insert the vehicle specification
    const vehicleSpecResult = await db_1.default
        .insert(schema_1.VehicleSpecifications)
        .values(vehicleSpec)
        .returning({ id: schema_1.VehicleSpecifications.vehicleSpec_id })
        .execute();
    // Insert the vehicle
    // get the vehicleSpec_id from the vehicleSpecResult
    const vehicleSpec_id = vehicleSpecResult[0].id;
    await db_1.default
        .insert(schema_1.Vehicles)
        .values({
        // spread the vehicle object because it contains the vehicleSpec_id
        ...vehicle,
        vehicleSpec_id: vehicleSpec_id,
    })
        .execute();
    return "Vehicle Spec and Vehicle created successfully!";
};
exports.createVehicleSpecServiceWithVehicleService = createVehicleSpecServiceWithVehicleService;
//updateVehicleSpecServiceWithVehicleService is a service
//that updates a vehicle specification and a vehicle in a single transaction.
//This service is useful when you want to update a vehicle specification and a vehicle at the same time.
const updateVehicleSpecServiceWithVehicleService = async (vehicleSpec, vehicle, vehicleSpecId) => {
    console.log("VehicleSpec", vehicleSpec);
    console.log("Vehicle", vehicle);
    // Validate the vehicleSpec object
    validators_1.vehicleSpecificationSchema.partial().parse(vehicleSpec);
    // Validate the vehicle object
    validators_1.vehicleSchema.partial().parse(vehicle);
    // Check if the vehicle specification exists
    const existingVehicleSpec = await db_1.default
        .select()
        .from(schema_1.VehicleSpecifications)
        .where((0, drizzle_orm_1.eq)(schema_1.VehicleSpecifications.vehicleSpec_id, vehicleSpecId))
        .execute();
    if (existingVehicleSpec.length === 0) {
        throw new Error("Vehicle specification not found");
    }
    // Check if the vehicle exists
    const existingVehicle = await db_1.default
        .select()
        .from(schema_1.Vehicles)
        .where((0, drizzle_orm_1.eq)(schema_1.Vehicles.vehicleSpec_id, vehicleSpecId))
        .execute();
    if (existingVehicle.length === 0) {
        throw new Error("Vehicle not found");
    }
    // Update the vehicle specification
    await db_1.default
        .update(schema_1.VehicleSpecifications)
        .set(vehicleSpec)
        .where((0, drizzle_orm_1.eq)(schema_1.VehicleSpecifications.vehicleSpec_id, vehicleSpecId))
        .execute();
    // Update the vehicle
    await db_1.default
        .update(schema_1.Vehicles)
        .set(vehicle)
        .where((0, drizzle_orm_1.eq)(schema_1.Vehicles.vehicleSpec_id, vehicleSpecId))
        .execute();
    return "Vehicle Spec and Vehicle updated successfully!";
};
exports.updateVehicleSpecServiceWithVehicleService = updateVehicleSpecServiceWithVehicleService;
//deleteVehicleSpecServiceWithVehicleService is a service that
//deletes a vehicle specification and a vehicle in a single transaction.
//This service is useful when you want to delete a vehicle specification and a vehicle at the same time.
const deleteVehicleSpecServiceWithVehicleService = async (vehicleSpecId) => {
    try {
        const vehicles = await db_1.default
            .select()
            .from(schema_1.Vehicles)
            .where((0, drizzle_orm_1.eq)(schema_1.Vehicles.vehicleSpec_id, vehicleSpecId))
            .execute();
        if (vehicles.length === 0) {
            throw new Error("Vehicle not found");
        }
        // Delete the vehicle
        await db_1.default
            .delete(schema_1.Vehicles)
            .where((0, drizzle_orm_1.eq)(schema_1.Vehicles.vehicleSpec_id, vehicleSpecId))
            .execute();
        // Delete the vehicle specification
        await db_1.default
            .delete(schema_1.VehicleSpecifications)
            .where((0, drizzle_orm_1.eq)(schema_1.VehicleSpecifications.vehicleSpec_id, vehicleSpecId))
            .execute();
        return "Vehicle Spec and Vehicle deleted successfully!";
    }
    catch (error) {
        throw new Error(`Failed to delete vehicle and its specifications: ${error.message}`);
    }
};
exports.deleteVehicleSpecServiceWithVehicleService = deleteVehicleSpecServiceWithVehicleService;
