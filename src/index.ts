import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authenticationRoutes } from "./routes/authentication/index.js";
import { cors } from "hono/cors";
import { webClientUrl } from "./utils/environment/index.js";



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

allRoutes.route("/authentications", authenticationRoutes
);

allRoutes.get("/hi", (c) => {
  return c.text("Welcome to the Authentication Service!");
});

serve(allRoutes, ({ port }) => {
  console.log(`\tRunning at http://localhost:${port}`);
});

