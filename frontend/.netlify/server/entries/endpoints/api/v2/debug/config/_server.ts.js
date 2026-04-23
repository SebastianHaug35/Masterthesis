import { s as superjsonResponse } from "../../../../../../chunks/superjsonResponse.js";
import { c as config } from "../../../../../../chunks/config.js";
import { a as requireAdmin } from "../../../../../../chunks/requireAuth.js";
const GET = async ({ locals }) => {
  requireAdmin(locals);
  const { models } = await import("../../../../../../chunks/models.js").then((n) => n.n);
  return superjsonResponse({
    OPENAI_BASE_URL: config.OPENAI_BASE_URL,
    OPENAI_API_KEY_SET: Boolean(config.OPENAI_API_KEY || config.HF_TOKEN),
    LEGACY_HF_TOKEN_SET: Boolean(config.HF_TOKEN && !config.OPENAI_API_KEY),
    MODELS_COUNT: models.length,
    NODE_VERSION: process.versions.node
  });
};
export {
  GET
};
