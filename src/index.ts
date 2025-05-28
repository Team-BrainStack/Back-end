import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authenticationRoutes } from "./routes/authentication/index.js";
import { cors } from "hono/cors";
import { webClientUrl } from "./utils/environment/index.js";
import { logger } from "hono/logger";



const allRoutes = new Hono();

allRoutes.use(
  cors({
    origin: webClientUrl,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
  }),
);

allRoutes.use(logger());

allRoutes.route("/auth", authenticationRoutes
);


serve(allRoutes, ({ port }) => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

