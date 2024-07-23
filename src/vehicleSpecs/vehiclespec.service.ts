import db from "../drizzle/db";
import { eq } from "drizzle-orm";

import {
  TIVehicleSpecifications,
  TSVehicleSpecifications,
  VehicleSpecifications,
  TIVehicles,
  Vehicles,
} from "../drizzle/schema";
import { vehicleSpecificationSchema, vehicleSchema } from "../validators";

export interface TVehicleSpecification {
  manufacturer: string;
  model: string;
  year: number;
  fuel_type: string;
  engine_capacity: string;
  transmission: string;
  seating_capacity: number;
  color: string;
  features: string;
  vehicleSpec_id?: number;
  vehicleSpecId?: number;
}

export interface TVehicles {
  vehicle_id: number;
  vehicleSpec_id: number;
  vehicle_image: string;
  rental_rate: number;
  availability: boolean;
  vehicleSpecs: TIVehicleSpecifications;
}

export const listVehicleSpecService = async (
  limit?: number
): Promise<TSVehicleSpecifications[] | null> => {
  if (limit) {
    return await db.query.VehicleSpecifications.findMany({
      limit: limit,
    });
  }
  return await db.query.VehicleSpecifications.findMany();
};

export const limitVehicleSpecService = async (
  limit: number
): Promise<TSVehicleSpecifications[] | null> => {
  return await db.select().from(VehicleSpecifications).limit(limit).execute();
};

export const getVehicleSpecsByIdService = async (
  id: number
): Promise<TSVehicleSpecifications | undefined> => {
  return await db.query.VehicleSpecifications.findFirst({
    where: eq(VehicleSpecifications.vehicleSpec_id, id),
  });
};

export const createVehicleSpecService = async (
  vehicleSpecs: TIVehicleSpecifications
): Promise<string> => {
  await db.insert(VehicleSpecifications).values(vehicleSpecs);
  return "Vehicle Specs created successfully!";
};

export const updateVehicleSpecService = async (
  id: number,
  vehicleSpecs: TIVehicleSpecifications
): Promise<string> => {
  await db
    .update(VehicleSpecifications)
    .set(vehicleSpecs)
    .where(eq(VehicleSpecifications.vehicleSpec_id, id));
  return "Vehicle Specs updated successfully!";
};

export const deleteVehicleSpecService = async (id: number): Promise<string> => {
  await db
    .delete(VehicleSpecifications)
    .where(eq(VehicleSpecifications.vehicleSpec_id, id));
  return "Vehicle Specs deleted successfully!";
};

//vehicleSpec with with vehicle
export const vehicleSpecWithVehicleService = async () => {
  const vehiclespecs = await db.query.VehicleSpecifications.findMany({
    columns: {
      created_at: false,
      updated_at: false,
    },
    with: {
      vehicles: {
        columns: {
          vehicle_id: true,
          vehicleSpec_id: true,
          vehicle_image: true,
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
        features: Array.isArray(spec.features) ? spec.features.join(", ") : "",
      };
    }

    return {
      vehicle_id: vehicle.vehicle_id,
      vehicleSpec_id: spec.vehicleSpec_id,
      vehicle_image: vehicle.vehicle_image,
      rental_rate: vehicle.rental_rate,
      availability: vehicle.availability,
      vehicleSpec: {
        vehicle_id: vehicle.vehicle_id,
        manufacturer: spec.manufacturer,
        model: spec.model,
        year: spec.year,
        fuel_type: spec.fuel_type,
        engine_capacity: spec.engine_capacity ?? "NA",
        transmission: spec.transmission ?? "",
        seating_capacity: spec.seating_capacity ?? 0,
        color: spec.color ?? "",
        features: spec.features ?? "",
      },
    };
  });
};

//get vehicleSpec with vehicle by id
export const vehicleSpecWithVehicleByIdService = async (
  vehicleid: number
): Promise<TVehicleSpecification | undefined> => {
  const result = await db.query.VehicleSpecifications.findMany({
    where: eq(VehicleSpecifications.vehicleSpec_id, vehicleid),
    columns: {
      vehicleSpec_id: false,
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
          vehicle_image: true,
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
    features: vehicleSpec.features ?? "",
  };
};

// createVehicleSpecServiceWithVehicleService is a service that
//creates a new vehicle specification and a vehicle in a single transaction.
// This service is useful when you want to create a new vehicle specification and a vehicle at the same time.

export const createVehicleSpecServiceWithVehicleService = async (
  vehicleSpec: TIVehicleSpecifications,
  vehicle: TIVehicles
): Promise<string> => {
  //console.log("vehicleSpec", vehicleSpec); to debug and check the vehicleSpec object
  console.log("VehicleSpec", vehicleSpec);
  console.log("Vehicle", vehicle);

  // Validate the vehicleSpec object
  vehicleSpecificationSchema.parse(vehicleSpec);
  // Validate the vehicle object
  vehicleSchema.parse(vehicle);

  //check if the vehicle already exists
  const existingVehicle = await db
    .select()
    .from(Vehicles)
    .where(eq(Vehicles.vehicleSpec_id, vehicle.vehicleSpec_id ?? 0))
    .execute();

  if (existingVehicle.length > 0) {
    throw new Error("Vehicle already exists");
  }

  // Insert the vehicle specification
  const vehicleSpecResult = await db
    .insert(VehicleSpecifications)
    .values(vehicleSpec)
    .returning({ id: VehicleSpecifications.vehicleSpec_id })
    .execute();

  // Insert the vehicle
  // get the vehicleSpec_id from the vehicleSpecResult
  const vehicleSpecId = vehicleSpecResult[0].id;

  await db
    .insert(Vehicles)
    .values({
      vehicle_id: vehicleSpecId,
      rental_rate: vehicle.rental_rate,
      availability: vehicle.availability,
      vehicle_image: vehicle.vehicle_image,
    })
    .execute();

  return "Vehicle Spec and Vehicle created successfully!";
};

//updateVehicleSpecServiceWithVehicleService is a service
//that updates a vehicle specification and a vehicle in a single transaction.
//This service is useful when you want to update a vehicle specification and a vehicle at the same time.
export const updateVehicleSpecServiceWithVehicleService = async (
  vehicleSpec: Partial<TIVehicleSpecifications>,
  vehicle: Partial<TIVehicles>,
  vehicleSpecId: number
): Promise<string> => {
  console.log("VehicleSpec", vehicleSpec);
  console.log("Vehicle", vehicle);

  // Validate the vehicleSpec object
  vehicleSpecificationSchema.partial().parse(vehicleSpec);
  // Validate the vehicle object
  vehicleSchema.partial().parse(vehicle);

  // Check if the vehicle specification exists
  const existingVehicleSpec = await db
    .select()
    .from(VehicleSpecifications)
    .where(eq(VehicleSpecifications.vehicleSpec_id, vehicleSpecId))
    .execute();

  if (existingVehicleSpec.length === 0) {
    throw new Error("Vehicle specification not found");
  }

  // Check if the vehicle exists
  const existingVehicle = await db
    .select()
    .from(Vehicles)
    .where(eq(Vehicles.vehicleSpec_id, vehicleSpecId))
    .execute();

  if (existingVehicle.length === 0) {
    throw new Error("Vehicle not found");
  }

  // Update the vehicle specification
  await db
    .update(VehicleSpecifications)
    .set(vehicleSpec)
    .where(eq(VehicleSpecifications.vehicleSpec_id, vehicleSpecId))
    .execute();

  // Update the vehicle
  await db
    .update(Vehicles)
    .set(vehicle)
    .where(eq(Vehicles.vehicleSpec_id, vehicleSpecId))
    .execute();

  return "Vehicle Spec and Vehicle updated successfully!";
};

//deleteVehicleSpecServiceWithVehicleService is a service that
//deletes a vehicle specification and a vehicle in a single transaction.
//This service is useful when you want to delete a vehicle specification and a vehicle at the same time.
export const deleteVehicleSpecServiceWithVehicleService = async (
  vehicleSpecId: number
): Promise<string> => {
  try {
    const vehicles = await db
      .select()
      .from(Vehicles)
      .where(eq(Vehicles.vehicleSpec_id, vehicleSpecId))
      .execute();

    if (vehicles.length === 0) {
      throw new Error("Vehicle not found");
    }

    // Delete the vehicle
    await db
      .delete(Vehicles)
      .where(eq(Vehicles.vehicleSpec_id, vehicleSpecId))
      .execute();

    // Delete the vehicle specification
    await db
      .delete(VehicleSpecifications)
      .where(eq(VehicleSpecifications.vehicleSpec_id, vehicleSpecId))
      .execute();

    return "Vehicle Spec and Vehicle deleted successfully!";
  } catch (error: any) {
    console.error(
      `Failed to delete vehicle and its specifications: ${error.message}`
    );
    throw new Error(
      `Failed to delete vehicle and its specifications: ${error.message}`
    );
  }
};
