import { b as base } from "../../../chunks/server.js";
import "../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import { collections } from "../../../chunks/database.js";
import { redirect } from "@sveltejs/kit";
import { c as config } from "../../../chunks/config.js";
async function POST({ locals, cookies }) {
  await collections.sessions.deleteOne({ sessionId: locals.sessionId });
  cookies.delete(config.COOKIE_NAME, {
    path: "/",
    // So that it works inside the space's iframe
    sameSite: config.ALLOW_INSECURE_COOKIES === "true" ? "lax" : "none",
    secure: !(config.ALLOW_INSECURE_COOKIES === "true"),
    httpOnly: true
  });
  return redirect(302, `${base}/`);
}
export {
  POST
};
