"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationBranchRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const validators_1 = require("../validators");
const location_controller_1 = require("./location.controller");
exports.locationBranchRouter = new hono_1.Hono();
exports.locationBranchRouter.get("/locationsBranches", location_controller_1.listLocationsBranches);
exports.locationBranchRouter.get("/locationsBranches/:id", location_controller_1.getLocationsAndBranchesById);
exports.locationBranchRouter.post("/locationsBranches", (0, zod_validator_1.zValidator)("json", validators_1.locationBranchSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), location_controller_1.createLocationsAndBranches);
exports.locationBranchRouter.put("/locationsBranches/:id", (0, zod_validator_1.zValidator)("json", validators_1.locationBranchSchema, (results, c) => {
    if (!results.success) {
        return c.json({ error: results.error }, 400);
    }
}), location_controller_1.updateLocationsAndBranches);
exports.locationBranchRouter.delete("/locationsBranches/:id", location_controller_1.deleteLocationsAndBranches);
exports.locationBranchRouter.get("/locationsBranches/limit", location_controller_1.limitLocationsAndBranches);
exports.locationBranchRouter.get("/locationsBranches-bookings", location_controller_1.locationWithBookings);
