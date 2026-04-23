import { i as attr_class, o as clsx, g as attr, h as stringify } from "./root.js";
import { u as usePublicConfig } from "./PublicConfig.svelte.js";
import { d as derived, w as writable } from "./index.js";
import { b as base } from "./server.js";
import "./url.js";
import "@sveltejs/kit/internal/server";
import { p as public_env } from "./shared-server.js";
function Logo($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const publicConfig = usePublicConfig();
    let { classNames = "" } = $$props;
    $$renderer2.push(`<img width="32" height="32"${attr_class(clsx(classNames))}${attr("alt", `${stringify(publicConfig.PUBLIC_APP_NAME)} logo`)}${attr("src", `${stringify(publicConfig.assetPath)}/logo.svg`)}/>`);
  });
}
function toKeyPart(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}
toKeyPart(public_env.PUBLIC_APP_ASSETS || public_env.PUBLIC_APP_NAME);
toKeyPart(typeof base === "string" ? base : "");
function loadSelectedIds() {
  return /* @__PURE__ */ new Set();
}
function loadDisabledBaseIds() {
  return /* @__PURE__ */ new Set();
}
const allMcpServers = writable([]);
const mcpServersLoaded = writable(false);
const selectedServerIds = writable(loadSelectedIds());
const enabledServers = derived(
  [allMcpServers, selectedServerIds],
  ([$all, $selected]) => $all.filter((s) => $selected.has(s.id))
);
const enabledServersCount = derived(enabledServers, ($enabled) => $enabled.length);
const allBaseServersEnabled = derived(
  [allMcpServers, selectedServerIds],
  ([$all, $selected]) => {
    const baseServers = $all.filter((s) => s.type === "base");
    return baseServers.length > 0 && baseServers.every((s) => $selected.has(s.id));
  }
);
function toggleServer(id) {
  selectedServerIds.update(($ids) => {
    const newSet = new Set($ids);
    if (newSet.has(id)) {
      newSet.delete(id);
      if (id.startsWith("base-")) {
        const disabled = loadDisabledBaseIds();
        disabled.add(id);
      }
    } else {
      newSet.add(id);
      if (id.startsWith("base-")) {
        const disabled = loadDisabledBaseIds();
        disabled.delete(id);
      }
    }
    return newSet;
  });
}
function updateServerStatus(id, status, errorMessage, tools, authRequired) {
  allMcpServers.update(
    ($servers) => $servers.map(
      (s) => s.id === id ? {
        ...s,
        status,
        errorMessage,
        tools,
        authRequired
      } : s
    )
  );
}
async function healthCheckServer(server) {
  try {
    updateServerStatus(server.id, "connecting");
    const response = await fetch(`${base}/api/mcp/health`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: server.url, headers: server.headers })
    });
    const result = await response.json();
    if (result.ready && result.tools) {
      updateServerStatus(server.id, "connected", void 0, result.tools, false);
      return { ready: true, tools: result.tools };
    } else {
      updateServerStatus(server.id, "error", result.error, void 0, Boolean(result.authRequired));
      return { ready: false, error: result.error };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    updateServerStatus(server.id, "error", errorMessage);
    return { ready: false, error: errorMessage };
  }
}
function createShareModalStore() {
  const { subscribe, set } = writable(false);
  return {
    subscribe,
    open: () => set(true),
    close: () => set(false)
  };
}
const shareModal = createShareModalStore();
export {
  Logo as L,
  allMcpServers as a,
  shareModal as b,
  allBaseServersEnabled as c,
  enabledServers as d,
  enabledServersCount as e,
  healthCheckServer as h,
  mcpServersLoaded as m,
  selectedServerIds as s,
  toggleServer as t
};
