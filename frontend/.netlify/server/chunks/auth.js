import { generators, Issuer, custom } from "openid-client";
import { addHours, subMinutes, addWeeks, differenceInMinutes } from "date-fns";
import { c as config, S as Semaphores } from "./config.js";
import { z } from "zod";
import { redirect } from "@sveltejs/kit";
import { collections } from "./database.js";
import JSON5 from "json5";
import { l as logger } from "./logger.js";
import { ObjectId } from "mongodb";
import { a as adminTokenManager } from "./adminToken.js";
import { b as base } from "./server.js";
import "./url.js";
import "@sveltejs/kit/internal/server";
import "./root.js";
import { a as acquireLock, r as releaseLock, i as isDBLocked } from "./lock.js";
async function sha256(input) {
  const utf8 = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
const stringWithDefault = (value) => z.string().default(value).transform((el) => el ? el : value);
const OIDConfig = z.object({
  CLIENT_ID: stringWithDefault(config.OPENID_CLIENT_ID),
  CLIENT_SECRET: stringWithDefault(config.OPENID_CLIENT_SECRET),
  PROVIDER_URL: stringWithDefault(config.OPENID_PROVIDER_URL),
  SCOPES: stringWithDefault(config.OPENID_SCOPES),
  NAME_CLAIM: stringWithDefault(config.OPENID_NAME_CLAIM).refine(
    (el) => !["preferred_username", "email", "picture", "sub"].includes(el),
    { message: "nameClaim cannot be one of the restricted keys." }
  ),
  TOLERANCE: stringWithDefault(config.OPENID_TOLERANCE),
  RESOURCE: stringWithDefault(config.OPENID_RESOURCE),
  ID_TOKEN_SIGNED_RESPONSE_ALG: z.string().optional()
}).parse(JSON5.parse(config.OPENID_CONFIG || "{}"));
const loginEnabled = !!OIDConfig.CLIENT_ID;
const sameSite = z.enum(["lax", "none", "strict"]).default(config.ALLOW_INSECURE_COOKIES === "true" ? "lax" : "none").parse(config.COOKIE_SAMESITE === "" ? void 0 : config.COOKIE_SAMESITE);
const secure = z.boolean().default(!(config.ALLOW_INSECURE_COOKIES === "true")).parse(config.COOKIE_SECURE === "" ? void 0 : config.COOKIE_SECURE === "true");
function sanitizeReturnPath(path) {
  if (!path) {
    return void 0;
  }
  if (path.startsWith("//")) {
    return void 0;
  }
  if (!path.startsWith("/")) {
    return void 0;
  }
  return path;
}
function refreshSessionCookie(cookies, sessionId) {
  cookies.set(config.COOKIE_NAME, sessionId, {
    path: "/",
    // So that it works inside the space's iframe
    sameSite,
    secure,
    httpOnly: true,
    expires: addWeeks(/* @__PURE__ */ new Date(), 2)
  });
}
async function findUser(sessionId, coupledCookieHash, url) {
  const session = await collections.sessions.findOne({ sessionId });
  if (!session) {
    return { user: null, invalidateSession: false };
  }
  if (coupledCookieHash && session.coupledCookieHash !== coupledCookieHash) {
    return { user: null, invalidateSession: true };
  }
  if (session.oauth?.token && session.oauth.refreshToken) {
    if (differenceInMinutes(session.oauth.token.expiresAt, /* @__PURE__ */ new Date()) < 5) {
      const lockKey = `${Semaphores.OAUTH_TOKEN_REFRESH}:${sessionId}`;
      const lockId = await acquireLock(lockKey);
      if (lockId) {
        try {
          const newTokenSet = await refreshOAuthToken(
            { redirectURI: `${config.PUBLIC_ORIGIN}${base}/login/callback` },
            session.oauth.refreshToken,
            url
          );
          if (!newTokenSet || !newTokenSet.access_token) {
            return { user: null, invalidateSession: true };
          }
          const updatedOAuth = tokenSetToSessionOauth(newTokenSet);
          if (!updatedOAuth) {
            return { user: null, invalidateSession: true };
          }
          await collections.sessions.updateOne(
            { sessionId },
            {
              $set: {
                oauth: updatedOAuth,
                updatedAt: /* @__PURE__ */ new Date()
              }
            }
          );
          session.oauth = updatedOAuth;
        } catch (err) {
          logger.error(err, "Error during token refresh:");
          return { user: null, invalidateSession: true };
        } finally {
          await releaseLock(lockKey, lockId);
        }
      } else if (/* @__PURE__ */ new Date() > session.oauth.token.expiresAt) {
        let attempts = 0;
        do {
          await new Promise((resolve) => setTimeout(resolve, 200));
          attempts++;
          if (attempts > 20) {
            return { user: null, invalidateSession: true };
          }
        } while (await isDBLocked(lockKey));
        const updatedSession = await collections.sessions.findOne({ sessionId });
        if (!updatedSession || updatedSession.oauth?.token === session.oauth.token) {
          return { user: null, invalidateSession: true };
        }
        session.oauth = updatedSession.oauth;
      }
    }
  } else if (session.oauth?.token && !session.oauth.refreshToken) {
    if (/* @__PURE__ */ new Date() > session.oauth.token.expiresAt) {
      return { user: null, invalidateSession: true };
    }
  }
  return {
    user: await collections.users.findOne({ _id: session.userId }),
    invalidateSession: false,
    oauth: session.oauth
  };
}
const authCondition = (locals) => {
  if (!locals.user && !locals.sessionId) {
    throw new Error("User or sessionId is required");
  }
  return locals.user ? { userId: locals.user._id } : { sessionId: locals.sessionId, userId: { $exists: false } };
};
function tokenSetToSessionOauth(tokenSet) {
  if (!tokenSet.access_token) {
    return void 0;
  }
  return {
    token: {
      value: tokenSet.access_token,
      expiresAt: tokenSet.expires_at ? subMinutes(new Date(tokenSet.expires_at * 1e3), 1) : addWeeks(/* @__PURE__ */ new Date(), 2)
    },
    refreshToken: tokenSet.refresh_token || void 0
  };
}
async function generateCsrfToken(sessionId, redirectUrl, next) {
  const sanitizedNext = sanitizeReturnPath(next);
  const data = {
    expiration: addHours(/* @__PURE__ */ new Date(), 1).getTime(),
    redirectUrl,
    ...sanitizedNext ? { next: sanitizedNext } : {}
  };
  return Buffer.from(
    JSON.stringify({
      data,
      signature: await sha256(JSON.stringify(data) + "##" + sessionId)
    })
  ).toString("base64");
}
let lastIssuer = null;
let lastIssuerFetchedAt = null;
async function getOIDCClient(settings, url) {
  if (lastIssuer && lastIssuerFetchedAt && differenceInMinutes(/* @__PURE__ */ new Date(), lastIssuerFetchedAt) >= 10) {
    lastIssuer = null;
    lastIssuerFetchedAt = null;
  }
  if (!lastIssuer) {
    lastIssuer = await Issuer.discover(OIDConfig.PROVIDER_URL);
    lastIssuerFetchedAt = /* @__PURE__ */ new Date();
  }
  const issuer = lastIssuer;
  const client_config = {
    client_id: OIDConfig.CLIENT_ID,
    client_secret: OIDConfig.CLIENT_SECRET,
    redirect_uris: [settings.redirectURI],
    response_types: ["code"],
    [custom.clock_tolerance]: OIDConfig.TOLERANCE || void 0,
    id_token_signed_response_alg: OIDConfig.ID_TOKEN_SIGNED_RESPONSE_ALG || void 0
  };
  if (OIDConfig.CLIENT_ID === "__CIMD__") {
    client_config.client_id = new URL(
      `${base}/.well-known/oauth-cimd`,
      config.PUBLIC_ORIGIN || url.origin
    ).toString();
  }
  const alg_supported = issuer.metadata["id_token_signing_alg_values_supported"];
  if (Array.isArray(alg_supported)) {
    client_config.id_token_signed_response_alg ??= alg_supported[0];
  }
  return new issuer.Client(client_config);
}
async function getOIDCAuthorizationUrl(settings, params) {
  const client = await getOIDCClient(settings, params.url);
  const csrfToken = await generateCsrfToken(
    params.sessionId,
    settings.redirectURI,
    sanitizeReturnPath(params.next)
  );
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);
  params.cookies.set("hfChat-codeVerifier", codeVerifier, {
    path: "/",
    sameSite,
    secure,
    httpOnly: true,
    expires: addHours(/* @__PURE__ */ new Date(), 1)
  });
  return client.authorizationUrl({
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    scope: OIDConfig.SCOPES,
    state: csrfToken,
    resource: OIDConfig.RESOURCE || void 0
  });
}
async function getOIDCUserData(settings, code, codeVerifier, iss, url) {
  const client = await getOIDCClient(settings, url);
  const token = await client.callback(
    settings.redirectURI,
    {
      code,
      iss
    },
    { code_verifier: codeVerifier }
  );
  const userData = await client.userinfo(token);
  return { token, userData };
}
async function refreshOAuthToken(settings, refreshToken, url) {
  const client = await getOIDCClient(settings, url);
  const tokenSet = await client.refresh(refreshToken);
  return tokenSet;
}
async function validateAndParseCsrfToken(token, sessionId) {
  try {
    const { data, signature } = z.object({
      data: z.object({
        expiration: z.number().int(),
        redirectUrl: z.string().url(),
        next: z.string().optional()
      }),
      signature: z.string().length(64)
    }).parse(JSON.parse(token));
    const reconstructSign = await sha256(JSON.stringify(data) + "##" + sessionId);
    if (data.expiration > Date.now() && signature === reconstructSign) {
      return { redirectUrl: data.redirectUrl, next: sanitizeReturnPath(data.next) };
    }
  } catch (e) {
    logger.error(e, "Error validating and parsing CSRF token");
  }
  return null;
}
async function getCoupledCookieHash(cookie) {
  if (!config.COUPLE_SESSION_WITH_COOKIE_NAME) {
    return void 0;
  }
  const cookieValue = cookie.get(config.COUPLE_SESSION_WITH_COOKIE_NAME);
  if (!cookieValue) {
    return "no-cookie";
  }
  return await sha256(cookieValue);
}
async function authenticateRequest(headers, cookie, url, isApi) {
  const token = cookie.get(config.COOKIE_NAME);
  let email = null;
  if (config.TRUSTED_EMAIL_HEADER) {
    email = headers.get(config.TRUSTED_EMAIL_HEADER);
  }
  let secretSessionId = null;
  let sessionId = null;
  if (email) {
    secretSessionId = sessionId = await sha256(email);
    return {
      user: {
        _id: new ObjectId(sessionId.slice(0, 24)),
        name: email,
        email,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        hfUserId: email,
        avatarUrl: ""
      },
      sessionId,
      secretSessionId,
      isAdmin: adminTokenManager.isAdmin(sessionId)
    };
  }
  if (token) {
    secretSessionId = token;
    sessionId = await sha256(token);
    const result = await findUser(sessionId, await getCoupledCookieHash(cookie), url);
    if (result.invalidateSession) {
      secretSessionId = crypto.randomUUID();
      sessionId = await sha256(secretSessionId);
      if (await collections.sessions.findOne({ sessionId })) {
        throw new Error("Session ID collision");
      }
    }
    return {
      user: result.user ?? void 0,
      token: result.oauth?.token?.value,
      sessionId,
      secretSessionId,
      isAdmin: result.user?.isAdmin || adminTokenManager.isAdmin(sessionId)
    };
  }
  if (isApi) {
    const authorization = headers.get("Authorization");
    if (authorization?.startsWith("Bearer ")) {
      const token2 = authorization.slice(7);
      const hash = await sha256(token2);
      sessionId = secretSessionId = hash;
      const cacheHit = await collections.tokenCaches.findOne({ tokenHash: hash });
      if (cacheHit) {
        const user2 = await collections.users.findOne({ hfUserId: cacheHit.userId });
        if (!user2) {
          throw new Error("User not found");
        }
        return {
          user: user2,
          sessionId,
          token: token2,
          secretSessionId,
          isAdmin: user2.isAdmin || adminTokenManager.isAdmin(sessionId)
        };
      }
      const response = await fetch("https://huggingface.co/api/whoami-v2", {
        headers: { Authorization: `Bearer ${token2}` }
      });
      if (!response.ok) {
        throw new Error("Unauthorized");
      }
      const data = await response.json();
      const user = await collections.users.findOne({ hfUserId: data.id });
      if (!user) {
        throw new Error("User not found");
      }
      await collections.tokenCaches.insertOne({
        tokenHash: hash,
        userId: data.id,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      return {
        user,
        sessionId,
        secretSessionId,
        token: token2,
        isAdmin: user.isAdmin || adminTokenManager.isAdmin(sessionId)
      };
    }
  }
  secretSessionId = crypto.randomUUID();
  sessionId = await sha256(secretSessionId);
  if (await collections.sessions.findOne({ sessionId })) {
    throw new Error("Session ID collision");
  }
  return { user: void 0, sessionId, secretSessionId, isAdmin: false };
}
async function triggerOauthFlow({ url, locals, cookies }) {
  let redirectURI = `${url.origin}${base}/login/callback`;
  if (url.searchParams.has("callback")) {
    const callback = url.searchParams.get("callback") || redirectURI;
    if (config.ALTERNATIVE_REDIRECT_URLS.includes(callback)) {
      redirectURI = callback;
    }
  }
  let next = void 0;
  const nextParam = sanitizeReturnPath(url.searchParams.get("next"));
  if (nextParam) {
    next = nextParam;
  } else if (!url.pathname.startsWith(`${base}/login`)) {
    next = sanitizeReturnPath(`${url.pathname}${url.search}`) ?? `${base}/`;
  } else {
    next = sanitizeReturnPath(`${base}/`) ?? "/";
  }
  const authorizationUrl = await getOIDCAuthorizationUrl(
    { redirectURI },
    { sessionId: locals.sessionId, next, url, cookies }
  );
  throw redirect(302, authorizationUrl);
}
export {
  OIDConfig as O,
  authCondition as a,
  tokenSetToSessionOauth as b,
  getOIDCUserData as c,
  authenticateRequest as d,
  getCoupledCookieHash as g,
  loginEnabled as l,
  refreshSessionCookie as r,
  sha256 as s,
  triggerOauthFlow as t,
  validateAndParseCsrfToken as v
};
