import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { vehicleSchema } from "../validators";
import {
  listVehicle,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  limitVehicle,
  vehicleWithDetail,
} from "./vehicle.controller";

import {
  adminRoleAuth,
  userRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

export const vehicleRouter = new Hono();

vehicleRouter.get("/vehicles", listVehicle);
vehicleRouter.get("/vehicles/:id", getVehicleById);

vehicleRouter.post(
  "/vehicles",
  zValidator("json", vehicleSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),
  createVehicle
);

vehicleRouter.put(
  "/vehicles/:id",
  zValidator("json", vehicleSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),

  updateVehicle
);

vehicleRouter.delete("/vehicles/:id", deleteVehicle);
vehicleRouter.get("/vehicles/limit/:limit", limitVehicle);

vehicleRouter.get("/vehicles-details", vehicleWithDetail);
