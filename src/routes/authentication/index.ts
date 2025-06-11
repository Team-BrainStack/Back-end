import auth from "../../utils/auth";
import { createUnsecureRoute } from "../middlewares/session-middleware";

export const authenticationRoutes = createUnsecureRoute();

 
authenticationRoutes.use((c) => {
    return auth.handler(c.req.raw);
})