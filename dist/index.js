"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const authentication_1 = require("./routes/authentication");
const memories_1 = __importDefault(require("./routes/memories"));
const cors_1 = require("hono/cors");
const environment_1 = require("./utils/environment");
const logger_1 = require("hono/logger");
const allRoutes = new hono_1.Hono();
allRoutes.use((0, cors_1.cors)({
    origin: environment_1.webClientUrl,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
}));
allRoutes.use((0, logger_1.logger)());
allRoutes.route("/auth", authentication_1.authenticationRoutes);
allRoutes.route("/memories", memories_1.default);
(0, node_server_1.serve)(allRoutes, ({ port }) => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
