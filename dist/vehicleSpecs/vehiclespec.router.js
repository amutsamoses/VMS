"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleSpecRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const validators_1 = require("../validators");
const vehiclespec_controller_1 = require("./vehiclespec.controller");
exports.vehicleSpecRouter = new hono_1.Hono();
exports.vehicleSpecRouter.get("/vehiclespecs", vehiclespec_controller_1.listVehicleSpec);
exports.vehicleSpecRouter.get("/vehiclespecs/:id", vehiclespec_controller_1.getVehicleSpecById);
exports.vehicleSpecRouter.post("/vehiclespecs", (0, zod_validator_1.zValidator)("json", validators_1.vehicleSpecificationSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), vehiclespec_controller_1.createVehicleSpecs);
exports.vehicleSpecRouter.put("/vehiclespecs/:id", (0, zod_validator_1.zValidator)("json", validators_1.vehicleSpecificationSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), vehiclespec_controller_1.updateVehicleSpecs);
exports.vehicleSpecRouter.delete("/vehiclespecs/:id", vehiclespec_controller_1.deleteVehicleSpecs);
exports.vehicleSpecRouter.get("/vehiclespecs/limit/:limit", vehiclespec_controller_1.limitVehicleSpecs);
exports.vehicleSpecRouter.get("/vehiclespecs-with-vehicles", vehiclespec_controller_1.vehicleSpecWithVehicle);
exports.vehicleSpecRouter.post("/vehiclespecs-vehicles", vehiclespec_controller_1.createVehicleSpecWithVehicle);
exports.vehicleSpecRouter.put("/vehiclespecs-vehicles/:id", vehiclespec_controller_1.updateVehicleSpecWithVehicle);
exports.vehicleSpecRouter.delete("/vehiclespecs-vehicles/:id", vehiclespec_controller_1.deleteVehicleSpecWithVehicle);
