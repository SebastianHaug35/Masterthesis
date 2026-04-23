import { l as logger } from "./logger.js";
import { collections } from "./database.js";
import { o as onExit } from "./exitHandler.js";
import { c as config } from "./config.js";
import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { s as ssrfSafeFetch } from "./urlSafety.js";
class AbortedGenerations {
  constructor() {
    this.abortedGenerations = {};
    const interval = setInterval(() => this.updateList(), 500);
    onExit(() => clearInterval(interval));
    this.updateList();
  }
  static getInstance() {
    if (!AbortedGenerations.instance) {
      AbortedGenerations.instance = new AbortedGenerations();
    }
    return AbortedGenerations.instance;
  }
  getAbortTime(conversationId) {
    return this.abortedGenerations[conversationId];
  }
  async updateList() {
    try {
      const aborts = await collections.abortedGenerations.find({}).sort({ createdAt: 1 }).toArray();
      this.abortedGenerations = Object.fromEntries(
        aborts.map((abort) => [abort.conversationId.toString(), abort.updatedAt ?? abort.createdAt])
      );
    } catch (err) {
      logger.error(err, "Error updating aborted generations list");
    }
  }
}
const DEFAULT_TTL_MS = 6e4;
const cache = /* @__PURE__ */ new Map();
function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}
function buildCacheKey(servers) {
  const normalized = servers.map((server) => ({
    name: server.name,
    url: server.url,
    headers: server.headers ? Object.entries(server.headers).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, value]) : []
  })).sort((a, b) => {
    const byName = a.name.localeCompare(b.name);
    if (byName !== 0) return byName;
    return a.url.localeCompare(b.url);
  });
  return JSON.stringify(normalized);
}
async function listServerTools(server, opts = {}) {
  const url = new URL(server.url);
  const client = new Client({ name: "chat-ui-mcp", version: "0.1.0" });
  try {
    try {
      const transport = new StreamableHTTPClientTransport(url, {
        requestInit: { headers: server.headers, signal: opts.signal },
        fetch: ssrfSafeFetch
      });
      await client.connect(transport);
    } catch {
      const transport = new SSEClientTransport(url, {
        requestInit: { headers: server.headers, signal: opts.signal },
        fetch: ssrfSafeFetch
      });
      await client.connect(transport);
    }
    const response = await client.listTools({});
    const tools = Array.isArray(response?.tools) ? response.tools : [];
    try {
      logger.debug(
        {
          server: server.name,
          url: server.url,
          count: tools.length,
          toolNames: tools.map((t) => t?.name).filter(Boolean)
        },
        "[mcp] listed tools from server"
      );
    } catch {
    }
    return tools;
  } finally {
    try {
      await client.close?.();
    } catch {
    }
  }
}
async function getOpenAiToolsForMcp(servers, { ttlMs = DEFAULT_TTL_MS, signal } = {}) {
  const now = Date.now();
  const cacheKey = buildCacheKey(servers);
  const cached = cache.get(cacheKey);
  if (cached && now - cached.fetchedAt < cached.ttlMs) {
    return { tools: cached.tools, mapping: cached.mapping };
  }
  const tools = [];
  const mapping = {};
  const seenNames = /* @__PURE__ */ new Set();
  const pushToolDefinition = (name, description, parameters) => {
    if (seenNames.has(name)) return;
    tools.push({
      type: "function",
      function: {
        name,
        description,
        parameters
      }
    });
    seenNames.add(name);
  };
  const tasks = servers.map((server) => listServerTools(server, { signal }));
  const results = await Promise.allSettled(tasks);
  for (let i = 0; i < results.length; i++) {
    const server = servers[i];
    const r = results[i];
    if (r.status === "fulfilled") {
      const serverTools = r.value;
      for (const tool of serverTools) {
        if (typeof tool.name !== "string" || tool.name.trim().length === 0) {
          continue;
        }
        const parameters = tool.inputSchema && typeof tool.inputSchema === "object" ? tool.inputSchema : void 0;
        const description = tool.description ?? tool.annotations?.title;
        const toolName = tool.name;
        let plainName = sanitizeName(toolName);
        if (plainName in mapping) {
          const suffix = sanitizeName(server.name);
          const candidate = `${plainName}_${suffix}`.slice(0, 64);
          if (!(candidate in mapping)) {
            plainName = candidate;
          } else {
            let i2 = 2;
            let next = `${candidate}_${i2}`;
            while (i2 < 10 && next in mapping) {
              i2 += 1;
              next = `${candidate}_${i2}`;
            }
            plainName = next.slice(0, 64);
          }
        }
        pushToolDefinition(plainName, description, parameters);
        mapping[plainName] = {
          fnName: plainName,
          server: server.name,
          tool: toolName
        };
      }
    } else {
      continue;
    }
  }
  cache.set(cacheKey, { fetchedAt: now, ttlMs, tools, mapping });
  return { tools, mapping };
}
function resetMcpToolsCache() {
  cache.clear();
}
let cachedRaw = null;
let cachedServers = [];
function parseServers(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => {
      if (!entry || typeof entry !== "object") return void 0;
      const name = entry.name;
      const url = entry.url;
      if (typeof name !== "string" || !name.trim()) return void 0;
      if (typeof url !== "string" || !url.trim()) return void 0;
      const headersRaw = entry.headers;
      let headers;
      if (headersRaw && typeof headersRaw === "object" && !Array.isArray(headersRaw)) {
        const headerEntries = Object.entries(headersRaw).filter(
          (entry2) => typeof entry2[1] === "string"
        );
        headers = Object.fromEntries(headerEntries);
      }
      return headers ? { name, url, headers } : { name, url };
    }).filter((server) => Boolean(server));
  } catch (error) {
    logger.warn({ err: error }, "[mcp] failed to parse MCP_SERVERS env");
    return [];
  }
}
function setServers(raw) {
  cachedServers = parseServers(raw);
  cachedRaw = raw;
  resetMcpToolsCache();
  logger.debug({ count: cachedServers.length }, "[mcp] loaded server configuration");
  console.log(
    `[MCP] Loaded ${cachedServers.length} server(s):`,
    cachedServers.map((s) => s.name).join(", ") || "none"
  );
}
function loadMcpServersOnStartup() {
  const raw = config.MCP_SERVERS || "[]";
  setServers(raw);
  return cachedServers;
}
function getMcpServers() {
  if (cachedRaw === null) {
    loadMcpServersOnStartup();
  }
  return cachedServers;
}
export {
  AbortedGenerations as A,
  getOpenAiToolsForMcp as a,
  getMcpServers as g,
  loadMcpServersOnStartup as l,
  resetMcpToolsCache as r
};
