import { s as superjsonResponse } from "../../../../../../chunks/superjsonResponse.js";
import { c as config } from "../../../../../../chunks/config.js";
import { a as requireAdmin } from "../../../../../../chunks/requireAuth.js";
const GET = async ({ locals }) => {
  requireAdmin(locals);
  const base = (config.OPENAI_BASE_URL || "https://router.huggingface.co/v1").replace(/\/$/, "");
  const res = await fetch(`${base}/models`);
  const body = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    parsed = void 0;
  }
  return superjsonResponse({
    status: res.status,
    ok: res.ok,
    base,
    length: (() => {
      if (parsed && typeof parsed === "object" && "data" in parsed) {
        const data = parsed.data;
        return Array.isArray(data) ? data.length : null;
      }
      return null;
    })(),
    sample: body.slice(0, 2e3)
  });
};
export {
  GET
};
