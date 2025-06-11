"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationRoutes = void 0;
const auth_js_1 = require("../../utils/auth.js");
const session_middleware_js_1 = require("../middlewares/session-middleware.js");
exports.authenticationRoutes = (0, session_middleware_js_1.createUnsecureRoute)();
exports.authenticationRoutes.use((c) => {
    return auth_js_1.default.handler(c.req.raw);
});
