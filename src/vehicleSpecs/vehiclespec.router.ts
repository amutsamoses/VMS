import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { vehicleSpecificationSchema } from "../validators";

import {
  listVehicleSpec,
  getVehicleSpecById,
  createVehicleSpecs,
  updateVehicleSpecs,
  deleteVehicleSpecs,
  limitVehicleSpecs,
  vehicleSpecWithVehicle,
  createVehicleSpecWithVehicle,
  updateVehicleSpecWithVehicle,
  deleteVehicleSpecWithVehicle,
} from "./vehiclespec.controller";
import {
  adminRoleAuth,
  userRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

export const vehicleSpecRouter = new Hono();

vehicleSpecRouter.get("/vehiclespecs", listVehicleSpec);
vehicleSpecRouter.get("/vehiclespecs/:id", getVehicleSpecById);

vehicleSpecRouter.post(
  "/vehiclespecs",
  zValidator("json", vehicleSpecificationSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),
  createVehicleSpecs
);

vehicleSpecRouter.put(
  "/vehiclespecs/:id",
  zValidator("json", vehicleSpecificationSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),
  updateVehicleSpecs
);

vehicleSpecRouter.delete("/vehiclespecs/:id", deleteVehicleSpecs);

vehicleSpecRouter.get("/vehiclespecs/limit/:limit", limitVehicleSpecs);

vehicleSpecRouter.get("/vehiclespecs-with-vehicles", vehicleSpecWithVehicle);

vehicleSpecRouter.post("/vehiclespecs-vehicles", createVehicleSpecWithVehicle);

vehicleSpecRouter.put(
  "/vehiclespecs-vehicles/:id",
  updateVehicleSpecWithVehicle
);

vehicleSpecRouter.delete(
  "/vehiclespecs-vehicles/:id",
  deleteVehicleSpecWithVehicle
);
