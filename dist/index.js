"use strict";
<<<<<<< HEAD
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const index_js_1 = require("./routes/authentication/index.js");
const index_js_2 = require("./routes/memories/index.js");
const cors_1 = require("hono/cors");
const index_js_3 = require("./utils/environment/index.js");
const logger_1 = require("hono/logger");
const allRoutes = new hono_1.Hono();
allRoutes.use((0, cors_1.cors)({
    origin: index_js_3.webClientUrl,
=======
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
>>>>>>> 8013f1d20bff9c1f8e6a1f0166ee09aec98b30ef
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
}));
allRoutes.use((0, logger_1.logger)());
<<<<<<< HEAD
allRoutes.route("/auth", index_js_1.authenticationRoutes);
allRoutes.route("/memories", index_js_2.default);
=======
allRoutes.route("/auth", authentication_1.authenticationRoutes);
allRoutes.route("/memories", memories_1.default);
>>>>>>> 8013f1d20bff9c1f8e6a1f0166ee09aec98b30ef
(0, node_server_1.serve)(allRoutes, ({ port }) => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
