import { Address4, Address6 } from "ip-address";
import { isIP } from "node:net";
import dns from "node:dns";
import { Agent, fetch } from "undici";
const UNSAFE_IPV4_SUBNETS = [
  "0.0.0.0/8",
  "100.64.0.0/10",
  "127.0.0.0/8",
  "169.254.0.0/16",
  "172.16.0.0/12",
  "192.168.0.0/16"
].map((s) => new Address4(s));
function isUnsafeIp(address) {
  const family = isIP(address);
  if (family === 4) {
    const addr = new Address4(address);
    return UNSAFE_IPV4_SUBNETS.some((subnet) => addr.isInSubnet(subnet));
  }
  if (family === 6) {
    const addr = new Address6(address);
    if (addr.is4()) {
      const v4 = addr.to4();
      return UNSAFE_IPV4_SUBNETS.some((subnet) => v4.isInSubnet(subnet));
    }
    return addr.isLoopback() || addr.isLinkLocal();
  }
  return true;
}
function isValidUrl(urlString) {
  try {
    const url = new URL(urlString.trim());
    if (url.protocol !== "https:") {
      return false;
    }
    const hostname = url.hostname.toLowerCase();
    if (hostname === "localhost") {
      return false;
    }
    const cleanHostname = hostname.replace(/^\[|]$/g, "");
    if (isIP(cleanHostname)) {
      return !isUnsafeIp(cleanHostname);
    }
    return true;
  } catch {
    return false;
  }
}
function assertSafeIp(address, hostname) {
  if (isUnsafeIp(address)) {
    throw new Error(`Resolved IP for ${hostname} is internal (${address})`);
  }
}
const ssrfSafeAgent = new Agent({
  connect: {
    lookup: (hostname, options, callback) => {
      dns.lookup(hostname, options, (err, address, family) => {
        if (err) return callback(err, "", 4);
        if (typeof address === "string") {
          try {
            assertSafeIp(address, hostname);
          } catch (e) {
            return callback(e, "", 4);
          }
        } else if (Array.isArray(address)) {
          for (const entry of address) {
            try {
              assertSafeIp(entry.address, hostname);
            } catch (e) {
              return callback(e, "", 4);
            }
          }
        }
        return callback(null, address, family);
      });
    }
  }
});
const MAX_REDIRECTS = 5;
const REDIRECT_STATUSES = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
async function ssrfSafeFetch(url, init) {
  const callerRedirect = init?.redirect ?? "follow";
  if (callerRedirect === "error") {
    const response = await fetch(url.toString(), {
      ...init,
      redirect: "manual",
      dispatcher: ssrfSafeAgent
    });
    if (REDIRECT_STATUSES.has(response.status)) {
      throw new TypeError("unexpected redirect");
    }
    return response;
  }
  if (callerRedirect === "manual") {
    return await fetch(url.toString(), {
      ...init,
      redirect: "manual",
      dispatcher: ssrfSafeAgent
    });
  }
  let currentUrl = url.toString();
  let currentInit = init;
  let redirectCount = 0;
  while (true) {
    const response = await fetch(currentUrl, {
      ...currentInit,
      redirect: "manual",
      dispatcher: ssrfSafeAgent
    });
    if (REDIRECT_STATUSES.has(response.status)) {
      redirectCount++;
      if (redirectCount > MAX_REDIRECTS) {
        throw new Error("Too many redirects");
      }
      const location = response.headers.get("location");
      if (!location) {
        throw new Error("Redirect without Location header");
      }
      const redirectUrl = new URL(location, currentUrl).toString();
      if (!isValidUrl(redirectUrl)) {
        throw new Error(`Redirect to unsafe URL blocked (SSRF): ${redirectUrl}`);
      }
      const method = (currentInit?.method ?? "GET").toUpperCase();
      if ([301, 302].includes(response.status) && method === "POST" || response.status === 303 && method !== "GET" && method !== "HEAD") {
        currentInit = { ...init, method: "GET", body: void 0 };
      }
      currentUrl = redirectUrl;
      continue;
    }
    return response;
  }
}
export {
  isValidUrl as i,
  ssrfSafeFetch as s
};
