"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const validators_1 = require("../validators");
const vehicle_controller_1 = require("./vehicle.controller");
exports.vehicleRouter = new hono_1.Hono();
exports.vehicleRouter.get("/vehicles", vehicle_controller_1.listVehicle);
exports.vehicleRouter.get("/vehicles/:id", vehicle_controller_1.getVehicleById);
exports.vehicleRouter.post("/vehicles", (0, zod_validator_1.zValidator)("json", validators_1.vehicleSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), vehicle_controller_1.createVehicle);
exports.vehicleRouter.put("/vehicles/:id", (0, zod_validator_1.zValidator)("json", validators_1.vehicleSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), vehicle_controller_1.updateVehicle);
exports.vehicleRouter.delete("/vehicles/:id", vehicle_controller_1.deleteVehicle);
exports.vehicleRouter.get("/vehicles/limit/:limit", vehicle_controller_1.limitVehicle);
exports.vehicleRouter.get("/vehicles-details", vehicle_controller_1.vehicleWithDetail);
