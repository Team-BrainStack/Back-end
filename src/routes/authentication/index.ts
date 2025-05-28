
import { auth } from "../../utils/auth.js";
import { createUnsecureRoute } from "../middlewares/session-middleware.js";

export const authenticationRoutes = createUnsecureRoute();

 
authenticationRoutes.use((c) => {
    return auth.handler(c.req.raw);
})