
import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authenticationRoutes } from "./routes/authentication";
import memoryRouter from "./routes/memories";
import { cors } from "hono/cors";
import { webClientUrl } from "./utils/environment";
import { logger } from "hono/logger";
import chatRoutesmistral from "./lib/chatbot.js";
import chatRoutes from "./routes/chats";



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

allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/memories", memoryRouter);
allRoutes.route("/chats",chatRoutesmistral)
allRoutes.route("/chatbot",chatRoutes)

serve(allRoutes, ({ port }) => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

