import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { FleetManagementSchema } from "../validators";

import {
  limitFleet,
  listFleet,
  getFleetById,
  createFleet,
  updateFleet,
  deleteFleet,
  fleetWithVehicle,
} from "./fleet.controller";

import {
  adminRoleAuth,
  userRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

export const fleetRouter = new Hono();

fleetRouter.get("/fleet", listFleet);
fleetRouter.get("/fleet/:id", getFleetById);

fleetRouter.post(
  "/fleet",
  zValidator("json", FleetManagementSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),

  createFleet
);

fleetRouter.put(
  "/fleet/:id",
  zValidator("json", FleetManagementSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),

  updateFleet
);

fleetRouter.delete("/fleet/:id", deleteFleet);

fleetRouter.get("/fleet/limit/:limit", limitFleet);

fleetRouter.get("/fleet-vehicles", fleetWithVehicle);
