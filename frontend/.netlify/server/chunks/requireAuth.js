import { error } from "@sveltejs/kit";
function requireAuth(locals) {
  if (!locals.user?._id && !locals.sessionId) {
    error(401, "Must have a valid session or user");
  }
}
function requireAdmin(locals) {
  if (!locals.user && !locals.sessionId) {
    error(401, "Unauthorized");
  }
  if (!locals.isAdmin) {
    error(403, "Admin privileges required");
  }
}
export {
  requireAdmin as a,
  requireAuth as r
};
