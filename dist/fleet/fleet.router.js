"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fleetRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const validators_1 = require("../validators");
const fleet_controller_1 = require("./fleet.controller");
exports.fleetRouter = new hono_1.Hono();
exports.fleetRouter.get("/fleet", fleet_controller_1.listFleet);
exports.fleetRouter.get("/fleet/:id", fleet_controller_1.getFleetById);
exports.fleetRouter.post("/fleet", (0, zod_validator_1.zValidator)("json", validators_1.FleetManagementSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), fleet_controller_1.createFleet);
exports.fleetRouter.put("/fleet/:id", (0, zod_validator_1.zValidator)("json", validators_1.FleetManagementSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), fleet_controller_1.updateFleet);
exports.fleetRouter.delete("/fleet/:id", fleet_controller_1.deleteFleet);
exports.fleetRouter.get("/fleet/limit/:limit", fleet_controller_1.limitFleet);
exports.fleetRouter.get("/fleet-vehicles", fleet_controller_1.fleetWithVehicle);
