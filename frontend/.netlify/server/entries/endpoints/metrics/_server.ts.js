import { c as config } from "../../../chunks/config.js";
import { M as MetricsServer } from "../../../chunks/metrics.js";
async function GET() {
  if (config.METRICS_ENABLED !== "true") {
    return new Response("Not Found", { status: 404 });
  }
  const payload = await MetricsServer.getInstance().render();
  return new Response(payload, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4",
      "Cache-Control": "no-store"
    }
  });
}
export {
  GET
};
