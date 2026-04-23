import { error } from "@sveltejs/kit";
import { l as logger } from "../../../../chunks/logger.js";
import { i as isValidUrl, s as ssrfSafeFetch } from "../../../../chunks/urlSafety.js";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const FETCH_TIMEOUT = 3e4;
const MAX_REDIRECTS = 5;
const SECURITY_HEADERS = {
  // Prevent any active content from executing if someone navigates directly to this endpoint.
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; sandbox; script-src 'none'; img-src 'none'; style-src 'none'; connect-src 'none'; media-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer"
};
async function GET({ url }) {
  const targetUrl = url.searchParams.get("url");
  if (!targetUrl) {
    logger.warn("Missing 'url' parameter");
    throw error(400, "Missing 'url' parameter");
  }
  if (!isValidUrl(targetUrl)) {
    logger.warn({ targetUrl }, "Invalid or unsafe URL (only HTTPS is supported)");
    throw error(400, "Invalid or unsafe URL (only HTTPS is supported)");
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  let currentUrl = targetUrl;
  let response;
  let redirectCount = 0;
  try {
    while (true) {
      response = await ssrfSafeFetch(currentUrl, {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "User-Agent": "HuggingChat-Attachment-Fetcher/1.0"
        }
      });
      if (response.status >= 300 && response.status < 400) {
        redirectCount++;
        if (redirectCount > MAX_REDIRECTS) {
          throw error(502, "Too many redirects");
        }
        const location = response.headers.get("location");
        if (!location) {
          throw error(502, "Redirect without Location header");
        }
        const redirectUrl = new URL(location, currentUrl).toString();
        if (!isValidUrl(redirectUrl)) {
          logger.warn(
            { redirectUrl, originalUrl: targetUrl },
            "Redirect to unsafe URL blocked (SSRF)"
          );
          throw error(403, "Redirect target is not allowed");
        }
        currentUrl = redirectUrl;
        continue;
      }
      break;
    }
  } finally {
    clearTimeout(timeoutId);
  }
  if (!response.ok) {
    logger.error({ targetUrl, response }, "Error fetching URL. Response not ok.");
    throw error(response.status, `Failed to fetch: ${response.statusText}`);
  }
  const contentLength = response.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
    throw error(413, "File too large (max 10MB)");
  }
  const originalContentType = response.headers.get("content-type") || "application/octet-stream";
  const safeContentType = "text/plain; charset=utf-8";
  const contentDisposition = response.headers.get("content-disposition");
  const headers = {
    "Content-Type": safeContentType,
    "X-Forwarded-Content-Type": originalContentType,
    "Cache-Control": "public, max-age=3600",
    ...contentDisposition ? { "Content-Disposition": contentDisposition } : {},
    ...SECURITY_HEADERS
  };
  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
    throw error(413, "File too large (max 10MB)");
  }
  return new Response(arrayBuffer, { headers });
}
export {
  GET
};
