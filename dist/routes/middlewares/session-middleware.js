"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = exports.createSecureRoute = exports.createUnsecureRoute = void 0;
const factory_1 = require("hono/factory");
const http_exception_1 = require("hono/http-exception");
const hono_1 = require("hono");
const auth_1 = __importDefault(require("../../utils/auth"));
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
    const session = await auth_1.default.api.getSession({ headers: context.req.raw.headers });
    if (!session) {
        throw new http_exception_1.HTTPException(401);
    }
    context.set("user", session.user);
    context.set("session", session.session);
    context.set("userId", session.user.id);
    return await next();
});
