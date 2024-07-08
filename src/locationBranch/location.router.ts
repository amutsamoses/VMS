import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { locationBranchSchema } from "../validators";

import {
  listLocationsBranches,
  getLocationsAndBranchesById,
  createLocationsAndBranches,
  updateLocationsAndBranches,
  deleteLocationsAndBranches,
  limitLocationsAndBranches,
} from "./location.controller";
import {
  adminRoleAuth,
  userRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

export const locationBranchRouter = new Hono();

locationBranchRouter.get("/locationsBranches", listLocationsBranches);
locationBranchRouter.get("/locationsBranches/:id", getLocationsAndBranchesById);

locationBranchRouter.post(
  "/locationsBranches",
  zValidator("json", locationBranchSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),
  createLocationsAndBranches
);

locationBranchRouter.put(
  "/locationsBranches/:id",
  zValidator("json", locationBranchSchema, (results, c) => {
    if (!results.success) {
      return c.json({ error: results.error }, 400);
    }
  }),
  updateLocationsAndBranches
);

locationBranchRouter.delete(
  "/locationsBranches/:id",
  deleteLocationsAndBranches
);

locationBranchRouter.get("/locationsBranches/limit", limitLocationsAndBranches);
