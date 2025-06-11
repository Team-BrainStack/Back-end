"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const plugins_1 = require("better-auth/plugins");
<<<<<<< HEAD
const index_js_1 = require("./environment/index.js");
const index_js_2 = require("../integrations/prisma/index.js");
const auth = (0, better_auth_1.betterAuth)({
    baseURL: index_js_1.serverUrl,
    basePath: "/auth",
    trustedOrigins: [index_js_1.webClientUrl],
    secret: index_js_1.betterAuthSecret,
    database: (0, prisma_1.prismaAdapter)(index_js_2.prismaClient, {
=======
const environment_1 = require("./environment");
const prisma_2 = require("../integrations/prisma");
const auth = (0, better_auth_1.betterAuth)({
    baseURL: environment_1.serverUrl,
    basePath: "/auth",
    trustedOrigins: [environment_1.webClientUrl],
    secret: environment_1.betterAuthSecret,
    database: (0, prisma_1.prismaAdapter)(prisma_2.prismaClient, {
>>>>>>> 8013f1d20bff9c1f8e6a1f0166ee09aec98b30ef
        provider: "postgresql",
    }),
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            partitioned: true,
        },
    },
    user: {
        modelName: "User",
    },
    session: {
        modelName: "Session",
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        }
    },
    account: {
        modelName: "Account",
    },
    verification: {
        modelName: "Verification",
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [(0, plugins_1.username)()]
});
exports.default = auth;
