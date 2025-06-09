import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { betterAuthSecret, serverUrl, webClientUrl } from "./environment";
import { prismaClient } from "../integrations/prisma";



const auth = betterAuth({
  baseURL: serverUrl,
  basePath: "/auth",
  trustedOrigins: [webClientUrl],
  secret: betterAuthSecret,
  database: prismaAdapter(prismaClient, {
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
    cookieCache:{
      enabled: true,
      maxAge: 5*60,
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
  plugins: [username()]
});

export default auth;