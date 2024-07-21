"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
require("dotenv/config");
const node_server_1 = require("@hono/node-server");
const http_exception_1 = require("hono/http-exception");
const logger_1 = require("hono/logger");
const csrf_1 = require("hono/csrf");
const cors_1 = require("hono/cors");
const trailing_slash_1 = require("hono/trailing-slash");
//importing the routes
const user_router_1 = require("./users/user.router");
const vehiclespec_router_1 = require("./vehicleSpecs/vehiclespec.router");
const vehicle_router_1 = require("./vehicle/vehicle.router");
const booking_router_1 = require("./bookings/booking.router");
const location_router_1 = require("./locationBranch/location.router");
const customer_router_1 = require("./customer/customer.router");
const fleet_router_1 = require("./fleet/fleet.router");
const pay_router_1 = require("./payment/pay.router");
const auth_router_1 = require("./auth/auth.router");
//initialize hono
const app = new hono_1.Hono().basePath("/api");
const custonTimeoutException = () => new http_exception_1.HTTPException(408, {
    message: `Request timeout after waiting for more than 10 seconds`,
});
app.use((0, logger_1.logger)()); // logs request and response to the console
app.use((0, csrf_1.csrf)()); // adds csrf token to the response header preventing csrf attacks
//default route
app.use((0, trailing_slash_1.trimTrailingSlash)()); // removes trailing slashes from the url
app.get("ok", (c) => {
    return c.text("The server is running😀");
});
app.get("/timeout", async (c) => {
    await new Promise((resolve) => setTimeout(resolve, 11000));
    return c.text("data after 5 seconds", 200);
});
app.use("*", (0, cors_1.cors)({
    origin: "http://localhost:5173", // Allow only your frontend's origin
    allowMethods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    allowHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
}));
//routes
app.route("/", user_router_1.userRouter);
app.route("/", vehiclespec_router_1.vehicleSpecRouter);
app.route("/", vehicle_router_1.vehicleRouter);
app.route("/", booking_router_1.bookingRouter);
app.route("/", location_router_1.locationBranchRouter);
app.route("/", customer_router_1.customerRouter);
app.route("/", fleet_router_1.fleetRouter);
app.route("/", pay_router_1.payRouter);
//auth routes
app.route("/auth", auth_router_1.authRouter);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: Number(process.env.PORT),
});
console.log(`Server is running on port ${process.env.PORT}`);
