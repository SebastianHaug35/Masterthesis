import { c as config } from "../../../../../chunks/config.js";
async function GET() {
  const mcpServersEnv = config.MCP_SERVERS || "[]";
  let servers = [];
  try {
    servers = JSON.parse(mcpServersEnv);
    if (!Array.isArray(servers)) {
      servers = [];
    }
  } catch (error) {
    console.error("Failed to parse MCP_SERVERS env variable:", error);
    servers = [];
  }
  const mcpServers = servers.map((server) => ({
    id: `base-${server.name}`,
    // Stable ID based on name
    name: server.name,
    url: server.url,
    type: "base",
    // headers intentionally omitted
    isLocked: false,
    // Base servers can be toggled by users
    status: void 0
    // Status determined client-side via health check
  }));
  return Response.json(mcpServers);
}
export {
  GET
};
