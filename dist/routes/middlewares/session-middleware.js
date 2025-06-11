"use strict";
<<<<<<< HEAD
=======
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
>>>>>>> 8013f1d20bff9c1f8e6a1f0166ee09aec98b30ef
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = exports.createSecureRoute = exports.createUnsecureRoute = void 0;
const factory_1 = require("hono/factory");
const http_exception_1 = require("hono/http-exception");
const hono_1 = require("hono");
<<<<<<< HEAD
const auth_js_1 = require("../../utils/auth.js");
=======
const auth_1 = __importDefault(require("../../utils/auth"));
>>>>>>> 8013f1d20bff9c1f8e6a1f0166ee09aec98b30ef
const createUnsecureRoute = () => {
    const route = new hono_1.Hono();
    return route;
};
exports.createUnsecureRoute = createUnsecureRoute;
const createSecureRoute = () => {
    const route = new hono_1.Hono();
    route.use(exports.authenticationMiddleware);
    return route;
};
exports.createSecureRoute = createSecureRoute;
exports.authenticationMiddleware = (0, factory_1.createMiddleware)(async (context, next) => {
<<<<<<< HEAD
    const session = await auth_js_1.default.api.getSession({ headers: context.req.raw.headers });
=======
    const session = await auth_1.default.api.getSession({ headers: context.req.raw.headers });
>>>>>>> 8013f1d20bff9c1f8e6a1f0166ee09aec98b30ef
    if (!session) {
        throw new http_exception_1.HTTPException(401);
    }
    context.set("user", session.user);
    context.set("session", session.session);
    context.set("userId", session.user.id);
    return await next();
});
