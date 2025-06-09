"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationRoutes = void 0;
const auth_1 = __importDefault(require("../../utils/auth"));
const session_middleware_1 = require("../middlewares/session-middleware");
exports.authenticationRoutes = (0, session_middleware_1.createUnsecureRoute)();
exports.authenticationRoutes.use((c) => {
    return auth_1.default.handler(c.req.raw);
});
