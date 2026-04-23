import { error } from "@sveltejs/kit";
import { s as superjsonResponse } from "../../../../../../chunks/superjsonResponse.js";
import { a as requireAdmin } from "../../../../../../chunks/requireAuth.js";
import { r as refreshModels, l as lastModelRefreshSummary } from "../../../../../../chunks/models.js";
const POST = async ({ locals }) => {
  requireAdmin(locals);
  const previous = lastModelRefreshSummary;
  try {
    const summary = await refreshModels();
    return superjsonResponse({
      refreshedAt: summary.refreshedAt.toISOString(),
      durationMs: summary.durationMs,
      added: summary.added,
      removed: summary.removed,
      changed: summary.changed,
      total: summary.total,
      hadChanges: summary.added.length > 0 || summary.removed.length > 0 || summary.changed.length > 0,
      previous: previous.refreshedAt.getTime() > 0 ? {
        refreshedAt: previous.refreshedAt.toISOString(),
        total: previous.total
      } : null
    });
  } catch {
    error(502, "Model refresh failed");
  }
};
export {
  POST
};
