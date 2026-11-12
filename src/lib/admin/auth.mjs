import { betterAuth } from "better-auth";
import { database } from "./database.mjs";

let instance;
export function createAuth(bootstrap = false) {
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL;
  if (!secret || secret.length < 32 || !baseURL) throw new Error("Configure BETTER_AUTH_SECRET and BETTER_AUTH_URL using the admin setup procedure.");
  const origin = new URL(baseURL).origin;
  if (process.env.NODE_ENV === "production" && !origin.startsWith("https://")) throw new Error("Production administration requires HTTPS.");
  return betterAuth({
    appName: "Yanina Cardozo Administración", baseURL: origin, basePath: "/api/auth", secret,
    database: database(), trustedOrigins: [origin],
    emailAndPassword: { enabled: true, disableSignUp: !bootstrap, minPasswordLength: 14, maxPasswordLength: 128, autoSignIn: false },
    session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 60, cookieCache: { enabled: false } },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 60, customRules: { "/sign-in/email": { window: 900, max: 5 } } },
    advanced: {
      // Direct connections share a persistent limiter; forwarded headers cannot bypass it.
      ipAddress: { ipAddressHeaders: [] },
      useSecureCookies: origin.startsWith("https://"),
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax", secure: origin.startsWith("https://") },
    },
  });
}
export function getAuth() { return instance ??= createAuth(); }
