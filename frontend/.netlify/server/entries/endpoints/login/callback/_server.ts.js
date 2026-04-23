import { error, redirect } from "@sveltejs/kit";
import { O as OIDConfig, s as sha256, g as getCoupledCookieHash, b as tokenSetToSessionOauth, r as refreshSessionCookie, v as validateAndParseCsrfToken, c as getOIDCUserData } from "../../../../chunks/auth.js";
import { z } from "zod";
import { b as base } from "../../../../chunks/server.js";
import "../../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import { c as config } from "../../../../chunks/config.js";
import JSON5 from "json5";
import { collections } from "../../../../chunks/database.js";
import { ObjectId } from "mongodb";
import { D as DEFAULT_SETTINGS } from "../../../../chunks/Settings.js";
import crypto from "crypto";
import { addWeeks } from "date-fns";
import { l as logger } from "../../../../chunks/logger.js";
async function updateUser(params) {
  const { userData, token, locals, cookies, userAgent, ip } = params;
  if (!userData.preferred_username && userData.upn) {
    userData.preferred_username = userData.upn;
  }
  const {
    preferred_username: username,
    name,
    email,
    picture: avatarUrl,
    sub: hfUserId,
    orgs
  } = z.object({
    preferred_username: z.string().optional(),
    name: z.string(),
    picture: z.string().optional(),
    sub: z.string(),
    email: z.string().email().optional(),
    orgs: z.array(
      z.object({
        sub: z.string(),
        name: z.string(),
        picture: z.string(),
        preferred_username: z.string(),
        plan: z.string().optional()
      })
    ).optional()
  }).setKey(OIDConfig.NAME_CLAIM, z.string()).refine((data) => data.preferred_username || data.email, {
    message: "Either preferred_username or email must be provided by the provider."
  }).transform((data) => ({
    ...data,
    name: data[OIDConfig.NAME_CLAIM]
  })).parse(userData);
  logger.info(
    {
      login_username: username,
      login_name: name,
      login_email: email,
      login_orgs: orgs?.map((el) => el.sub)
    },
    "user login"
  );
  const isAdmin = config.HF_ORG_ADMIN && orgs?.some((org) => org.sub === config.HF_ORG_ADMIN) || false;
  const isEarlyAccess = config.HF_ORG_EARLY_ACCESS && orgs?.some((org) => org.sub === config.HF_ORG_EARLY_ACCESS) || false;
  logger.debug(
    {
      isAdmin,
      isEarlyAccess,
      hfUserId
    },
    `Updating user ${hfUserId}`
  );
  const existingUser = await collections.users.findOne({ hfUserId });
  let userId = existingUser?._id;
  const previousSessionId = locals.sessionId;
  const secretSessionId = crypto.randomUUID();
  const sessionId = await sha256(secretSessionId);
  if (await collections.sessions.findOne({ sessionId })) {
    error(500, "Session ID collision");
  }
  locals.sessionId = sessionId;
  const coupledCookieHash = await getCoupledCookieHash(cookies);
  const oauthData = tokenSetToSessionOauth(token);
  if (existingUser) {
    await collections.users.updateOne(
      { _id: existingUser._id },
      { $set: { username, name, avatarUrl, isAdmin, isEarlyAccess } }
    );
    await collections.sessions.deleteOne({ sessionId: previousSessionId });
    await collections.sessions.insertOne({
      _id: new ObjectId(),
      sessionId: locals.sessionId,
      userId: existingUser._id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      userAgent,
      ip,
      expiresAt: addWeeks(/* @__PURE__ */ new Date(), 2),
      ...coupledCookieHash ? { coupledCookieHash } : {},
      ...oauthData ? { oauth: oauthData } : {}
    });
  } else {
    const { insertedId } = await collections.users.insertOne({
      _id: new ObjectId(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      username,
      name,
      email,
      avatarUrl,
      hfUserId,
      isAdmin,
      isEarlyAccess
    });
    userId = insertedId;
    await collections.sessions.insertOne({
      _id: new ObjectId(),
      sessionId: locals.sessionId,
      userId,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      userAgent,
      ip,
      expiresAt: addWeeks(/* @__PURE__ */ new Date(), 2),
      ...coupledCookieHash ? { coupledCookieHash } : {},
      ...oauthData ? { oauth: oauthData } : {}
    });
    const { matchedCount } = await collections.settings.updateOne(
      { sessionId: previousSessionId },
      {
        $set: { userId, updatedAt: /* @__PURE__ */ new Date() },
        $unset: { sessionId: "" }
      }
    );
    if (!matchedCount) {
      await collections.settings.insertOne({
        userId,
        updatedAt: /* @__PURE__ */ new Date(),
        createdAt: /* @__PURE__ */ new Date(),
        ...DEFAULT_SETTINGS
      });
    }
  }
  refreshSessionCookie(cookies, secretSessionId);
  await collections.conversations.updateMany(
    { sessionId: previousSessionId },
    {
      $set: { userId },
      $unset: { sessionId: "" }
    }
  );
}
const sanitizeJSONEnv = (val, fallback) => {
  const raw = (val ?? "").trim();
  const unquoted = raw.startsWith("`") && raw.endsWith("`") ? raw.slice(1, -1) : raw;
  return unquoted || fallback;
};
const allowedUserEmails = z.array(z.string().email()).optional().default([]).parse(JSON5.parse(sanitizeJSONEnv(config.ALLOWED_USER_EMAILS, "[]")));
const allowedUserDomains = z.array(z.string().regex(/\.\w+$/)).optional().default([]).parse(JSON5.parse(sanitizeJSONEnv(config.ALLOWED_USER_DOMAINS, "[]")));
async function GET({ url, locals, cookies, request, getClientAddress }) {
  const { error: errorName, error_description: errorDescription } = z.object({
    error: z.string().optional(),
    error_description: z.string().optional()
  }).parse(Object.fromEntries(url.searchParams.entries()));
  if (errorName) {
    throw error(400, errorName + (errorDescription ? ": " + errorDescription : ""));
  }
  const { code, state, iss } = z.object({
    code: z.string(),
    state: z.string(),
    iss: z.string().optional()
  }).parse(Object.fromEntries(url.searchParams.entries()));
  const csrfToken = Buffer.from(state, "base64").toString("utf-8");
  const validatedToken = await validateAndParseCsrfToken(csrfToken, locals.sessionId);
  if (!validatedToken) {
    throw error(403, "Invalid or expired CSRF token");
  }
  const codeVerifier = cookies.get("hfChat-codeVerifier");
  if (!codeVerifier) {
    throw error(403, "Code verifier cookie not found");
  }
  const { userData, token } = await getOIDCUserData(
    { redirectURI: validatedToken.redirectUrl },
    code,
    codeVerifier,
    iss,
    url
  );
  if (allowedUserEmails.length > 0 || allowedUserDomains.length > 0) {
    if (!userData.email) {
      throw error(403, "User not allowed: email not returned");
    }
    const emailVerified = userData.email_verified ?? true;
    if (!emailVerified) {
      throw error(403, "User not allowed: email not verified");
    }
    const emailDomain = userData.email.split("@")[1];
    const isEmailAllowed = allowedUserEmails.includes(userData.email);
    const isDomainAllowed = allowedUserDomains.includes(emailDomain);
    if (!isEmailAllowed && !isDomainAllowed) {
      throw error(403, "User not allowed");
    }
  }
  await updateUser({
    userData,
    token,
    locals,
    cookies,
    userAgent: request.headers.get("user-agent") ?? void 0,
    ip: getClientAddress()
  });
  const next = validatedToken.next;
  if (next) {
    return redirect(302, next);
  }
  return redirect(302, `${base}/`);
}
export {
  GET
};
