import { Hono } from "hono";
import "dotenv/config";
import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";
import { trimTrailingSlash } from "hono/trailing-slash";

//importing the routes
import { userRouter } from "./users/user.router";
import { vehicleSpecRouter } from "./vehicleSpecs/vehiclespec.router";
import { vehicleRouter } from "./vehicle/vehicle.router";
import { bookingRouter } from "./bookings/booking.router";
import { locationBranchRouter } from "./locationBranch/location.router";
import { customerRouter } from "./customer/customer.router";
import { fleetRouter } from "./fleet/fleet.router";
import { payRouter } from "./payment/pay.router";
import { authRouter } from "./auth/auth.router";

//initialize hono
const app = new Hono();

const custonTimeoutException = () =>
  new HTTPException(408, {
    message: `Request timeout after waiting for more than 10 seconds`,
  });

app.use(logger()); // logs request and response to the console
app.use(csrf()); // adds csrf token to the response header preventing csrf attacks
//default route
app.use(trimTrailingSlash()); // removes trailing slashes from the url

app.get("/ok", (c) => {
  return c.text("The server is running😀");
});

app.get("/timeout", async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 11000));
  return c.text("data after 5 seconds", 200);
});

app.use(
  "*",
  cors({
    origin: "https://carrentalhub-kephar-moses-projects.vercel.app/", // Allow only your frontend's origin
    allowMethods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    allowHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

//routes
app.route("/", userRouter);
app.route("/", vehicleSpecRouter);
app.route("/", vehicleRouter);
app.route("/", bookingRouter);
app.route("/", locationBranchRouter);
app.route("/", customerRouter);
app.route("/", fleetRouter);
app.route("/", payRouter);

//auth routes
app.route("/auth", authRouter);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT),
});
console.log(`Server is running on port ${process.env.PORT}`);
