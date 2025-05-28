import type { Session, User } from "better-auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import auth from "../../utils/auth.js";



export type SecureSession = {
  Variables: {
    user: User;
    session: Session;
    userId: string;
  };
};

export const createUnsecureRoute = (): Hono => {
  const route = new Hono();

  return route;
};

export const createSecureRoute = (): Hono<SecureSession> => {
  const route = new Hono<SecureSession>();

  route.use(authenticationMiddleware);

  return route;
};

export const authenticationMiddleware = createMiddleware<SecureSession>(async (context, next) => {
  const session = await auth.api.getSession({ headers: context.req.raw.headers });

  if (!session) {
    throw new HTTPException(401);
  }

  context.set("user", session.user as User);
  context.set("session", session.session as Session);
  context.set("userId", session.user.id);
  
  return await next();
});