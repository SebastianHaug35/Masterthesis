import { json } from "@sveltejs/kit";
import { l as logger } from "../../../../../chunks/logger.js";
import { c as computeAllStats } from "../../../../../chunks/refresh-conversation-stats.js";
async function POST() {
  computeAllStats().catch((e) => logger.error(e, "Error computing all stats"));
  return json(
    {
      message: "Stats job started"
    },
    { status: 202 }
  );
}
export {
  POST
};
