import { d as sanitize_props, f as attributes, i as attr_class, h as stringify, g as attr, e as escape_html, j as ensure_array_like, m as derived, o as clsx, k as store_get, u as unsubscribe_stores, l as bind_props, E as props_id, F as spread_props, x as attr_style, G as await_block } from "./root.js";
import { t as tick, o as onDestroy } from "./index-server.js";
import { I as IconOmni } from "./IconOmni.js";
import { I as IconFast, a as IconCheap } from "./IconCheap.js";
import { h as html } from "./html.js";
import { PROVIDERS_HUB_ORGS } from "@huggingface/inference";
import "@sveltejs/kit/internal";
import "./url.js";
import "./utils.js";
import "@sveltejs/kit/internal/server";
import "./exports.js";
import { g as goto } from "./client.js";
import { C as Close } from "./close.js";
import { M as Modal } from "./Modal.js";
import { I as IMAGE_MIME_ALLOWLIST_DEFAULT, T as TEXT_MIME_ALLOWLIST } from "./mime.js";
import { u as usePublicConfig } from "./PublicConfig.svelte.js";
import { t as toggleServer, h as healthCheckServer, a as allMcpServers, s as selectedServerIds, e as enabledServersCount, L as Logo, b as shareModal, c as allBaseServersEnabled, m as mcpServersLoaded } from "./shareModal.js";
import { T as Trash_can } from "./trash-can.js";
import { H as Hammer } from "./hammer.js";
import { S as Switch } from "./Switch.js";
import { b as base } from "./server.js";
import { p as page } from "./index2.js";
import { n as noop, M as MenuSubmenuState, b as boxWith, F as Floating_layer, c as createId, a as MenuItemState, m as mergeProps, d as MenuSeparatorState, e as MenuContentState, P as Popper_layer_force_mount, f as Popper_layer, g as MenuOpenEvent, i as isHTMLElement, h as getFloatingContentCSSVars, S as SUB_CLOSE_KEYS, j as MenuSubTriggerState, k as Floating_layer_anchor, l as MenuCheckboxGroupContext, w as watch, o as MenuCheckboxItemState, p as MenuRootState, q as MenuMenuState, D as DropdownMenuTriggerState, r as Portal, C as CopyToClipBoardBtn, s as Check, t as Copy } from "./check.js";
import katex from "katex";
import "katex/dist/contrib/mhchem.mjs";
import { Lexer, Marked } from "marked";
import { parseDocument } from "htmlparser2";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import shell from "highlight.js/lib/languages/shell";
import python from "highlight.js/lib/languages/python";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import java from "highlight.js/lib/languages/java";
import csharp from "highlight.js/lib/languages/csharp";
import cpp from "highlight.js/lib/languages/cpp";
import cLang from "highlight.js/lib/languages/c";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import scss from "highlight.js/lib/languages/scss";
import markdownLang from "highlight.js/lib/languages/markdown";
import yaml from "highlight.js/lib/languages/yaml";
import sql from "highlight.js/lib/languages/sql";
import plaintext from "highlight.js/lib/languages/plaintext";
import DOMPurify from "isomorphic-dompurify";
import { i as isMessageToolCallUpdate, a as isMessageToolResultUpdate, b as isMessageToolErrorUpdate, c as isMessageToolProgressUpdate, d as isMessageToolUpdate } from "./messageUpdates.js";
import { M as MessageUpdateType } from "./MessageUpdate.js";
import "clsx";
import { u as useSettingsStore } from "./settings2.js";
async function getInstance() {
  return null;
}
function fire(pattern) {
  Promise.resolve(getInstance()).then((h) => h?.trigger(pattern)).catch(() => {
  });
}
function tap() {
  fire("light");
}
function streamStart() {
  return;
}
function requireAuthUser() {
  if (page.data.loginEnabled && !page.data.user) {
    const next = page.url.pathname + page.url.search;
    const url = `${base}/login?next=${encodeURIComponent(next)}`;
    goto(url, {});
    return true;
  }
  return false;
}
function Checkmark_filled($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"/><path fill="none" d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585z"/>`)}</svg>`);
}
function Warning_filled($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14s14-6.3 14-14S23.7 2 16 2m-1.1 6h2.2v11h-2.2zM16 25c-.8 0-1.5-.7-1.5-1.5S15.2 22 16 22s1.5.7 1.5 1.5S16.8 25 16 25"/>`)}</svg>`);
}
function Pending_filled($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2M8 18a2 2 0 1 1 2-2a2 2 0 0 1-2 2m8 0a2 2 0 1 1 2-2a2 2 0 0 1-2 2m8 0a2 2 0 1 1 2-2a2 2 0 0 1-2 2"/><path fill="none" d="M10 16a2 2 0 1 1-2-2a2 2 0 0 1 2 2m6-2a2 2 0 1 0 2 2a2 2 0 0 0-2-2m8 0a2 2 0 1 0 2 2a2 2 0 0 0-2-2"/>`)}</svg>`);
}
function Renew($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M12 10H6.78A11 11 0 0 1 27 16h2A13 13 0 0 0 6 7.68V4H4v8h8zm8 12h5.22A11 11 0 0 1 5 16H3a13 13 0 0 0 23 8.32V28h2v-8h-8z"/>`)}</svg>`);
}
function Settings($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z"/><path fill="currentColor" d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4"/>`)}</svg>`);
}
function getMcpServerFaviconUrl(serverUrl, size = 64) {
  try {
    const parsed = new URL(serverUrl);
    const hostnameParts = parsed.hostname.split(".");
    const rootDomain = hostnameParts.length >= 2 ? hostnameParts.slice(-2).join(".") : parsed.hostname;
    const domain = `${parsed.protocol}//${rootDomain}`;
    return `https://www.google.com/s2/favicons?sz=${size}&domain_url=${encodeURIComponent(domain)}`;
  } catch {
    return `https://www.google.com/s2/favicons?sz=${size}&domain_url=${encodeURIComponent(serverUrl)}`;
  }
}
function isStrictHfMcpLogin(urlString) {
  try {
    const u = new URL(urlString);
    const host = u.hostname.toLowerCase();
    const allowedHosts = /* @__PURE__ */ new Set(["hf.co", "huggingface.co"]);
    return u.protocol === "https:" && allowedHosts.has(host) && u.pathname === "/mcp" && u.search === "?login";
  } catch {
    return false;
  }
}
function ServerCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { server, isSelected } = $$props;
    let isLoadingHealth = false;
    const isHfMcp = derived(() => isStrictHfMcpLogin(server.url));
    const statusInfo = derived(() => {
      switch (server.status) {
        case "connected":
          return {
            label: "Connected",
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/20",
            icon: Checkmark_filled
          };
        case "connecting":
          return {
            label: "Connecting...",
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
            icon: Pending_filled
          };
        case "error":
          return {
            label: "Error",
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-900/20",
            icon: Warning_filled
          };
        case "disconnected":
        default:
          return {
            label: "Unknown",
            color: "text-gray-600 dark:text-gray-400",
            bgColor: "bg-gray-100 dark:bg-gray-700",
            icon: Pending_filled
          };
      }
    });
    function setEnabled(v) {
      if (v === isSelected) return;
      toggleServer(server.id);
      if (v && server.status !== "connected") handleHealthCheck();
    }
    async function handleHealthCheck() {
      isLoadingHealth = true;
      try {
        await healthCheckServer(server);
      } finally {
        isLoadingHealth = false;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      var bind_get = () => isSelected;
      var bind_set = setEnabled;
      $$renderer3.push(`<div${attr_class(`rounded-lg border bg-gradient-to-br transition-colors ${stringify(isSelected ? "border-blue-600/20 bg-blue-50 from-blue-500/5 to-transparent dark:border-blue-700/60 dark:bg-blue-900/10 dark:from-blue-900/20" : "border-gray-200 bg-white from-black/5 dark:border-gray-700 dark:bg-gray-800 dark:from-white/5")}`)}><div class="px-4 py-3.5"><div class="mb-3 flex items-start justify-between gap-3"><div class="min-w-0 flex-1"><div class="mb-0.5 flex items-center gap-2"><img${attr("src", getMcpServerFaviconUrl(server.url))} alt="" class="size-4 flex-shrink-0 rounded"/> <h3 class="truncate font-semibold text-gray-900 dark:text-gray-100">${escape_html(server.name)}</h3></div> <p class="truncate text-sm text-gray-600 dark:text-gray-400">${escape_html(server.url)}</p></div> `);
      Switch($$renderer3, {
        name: `enable-${server.id}`,
        get checked() {
          return bind_get();
        },
        set checked($$value) {
          bind_set($$value);
        }
      });
      $$renderer3.push(`<!----></div> `);
      if (server.status) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="mb-2 flex items-center gap-2"><span${attr_class(`inline-flex items-center gap-1 rounded-full ${stringify(statusInfo().bgColor)} py-0.5 pl-1.5 pr-2 text-xs font-medium ${stringify(statusInfo().color)}`)}>`);
        if (server.status === "connected") {
          $$renderer3.push("<!--[0-->");
          Checkmark_filled($$renderer3, { class: "size-3" });
        } else if (server.status === "connecting") {
          $$renderer3.push("<!--[1-->");
          Pending_filled($$renderer3, { class: "size-3" });
        } else if (server.status === "error") {
          $$renderer3.push("<!--[2-->");
          Warning_filled($$renderer3, { class: "size-3" });
        } else {
          $$renderer3.push("<!--[-1-->");
          Pending_filled($$renderer3, { class: "size-3" });
        }
        $$renderer3.push(`<!--]--> ${escape_html(statusInfo().label)}</span> `);
        if (server.tools && server.tools.length > 0) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<span class="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">`);
          Hammer($$renderer3, { class: "size-3" });
          $$renderer3.push(`<!----> ${escape_html(server.tools.length)}
						${escape_html(server.tools.length === 1 ? "tool" : "tools")}</span>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (server.errorMessage) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="mb-2 flex items-center gap-2"><div class="line-clamp-6 break-words rounded bg-red-50 px-2 py-1 text-xs text-red-800 dark:bg-red-900/20 dark:text-red-200">${escape_html(server.errorMessage)}</div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="flex flex-wrap gap-1"><button${attr("disabled", isLoadingHealth, true)} class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-[.29rem] text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">`);
      Renew($$renderer3, {
        class: `size-3 ${stringify(isLoadingHealth ? "animate-spin" : "")}`
      });
      $$renderer3.push(`<!----> Health Check</button> `);
      if (isHfMcp()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<a href="https://huggingface.co/settings/mcp" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-[.29rem] text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600" aria-label="Open Hugging Face MCP settings">`);
        Settings($$renderer3, { class: "size-3" });
        $$renderer3.push(`<!----> Settings</a>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (server.type === "custom") {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<button class="flex items-center gap-1.5 rounded-lg border border-red-500/15 bg-red-50 px-2.5 py-[.29rem] text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-500/25 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50">`);
        Trash_can($$renderer3, { class: "size-3" });
        $$renderer3.push(`<!----> Delete</button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      if (server.tools && server.tools.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<details class="mt-3"><summary class="cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">Available Tools (${escape_html(server.tools.length)})</summary> <ul class="mt-2 space-y-1 text-xs"><!--[-->`);
        const each_array = ensure_array_like(server.tools);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let tool = each_array[$$index];
          $$renderer3.push(`<li class="text-gray-600 dark:text-gray-400"><span class="font-medium text-gray-900 dark:text-gray-100">${escape_html(tool.name)}</span> `);
          if (tool.description) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span class="text-gray-500 dark:text-gray-500">- ${escape_html(tool.description)}</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></li>`);
        }
        $$renderer3.push(`<!--]--></ul></details>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Add_large($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M17 15V5h-2v10H5v2h10v10h2V17h10v-2z"/>`)}</svg>`);
}
function IconMCP($$renderer, $$props) {
  let { classNames = "" } = $$props;
  $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg"${attr_class(clsx(classNames))} width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="m3.5 11.75l8.172-8.171a2.828 2.828 0 1 1 4 4m0 0L9.5 13.75m6.172-6.171a2.828 2.828 0 0 1 4 4l-6.965 6.964a1 1 0 0 0 0 1.414L14 21.25"></path><path d="m17.5 9.75l-6.172 6.171a2.829 2.829 0 0 1-4-4L13.5 5.749"></path></g></svg>`);
}
function MCPServerManager($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const publicConfig = usePublicConfig();
    let { onclose } = $$props;
    let isRefreshing = false;
    const baseServers = derived(() => store_get($$store_subs ??= {}, "$allMcpServers", allMcpServers).filter((s) => s.type === "base"));
    const customServers = derived(() => store_get($$store_subs ??= {}, "$allMcpServers", allMcpServers).filter((s) => s.type === "custom"));
    const enabledCount = derived(() => store_get($$store_subs ??= {}, "$enabledServersCount", enabledServersCount));
    Modal($$renderer2, {
      width: "w-[800px]",
      onclose,
      closeButton: true,
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="p-6"><div class="mb-6"><h2 class="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-200">`);
        {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`MCP Servers`);
        }
        $$renderer3.push(`<!--]--></h2> <p class="text-sm text-gray-600 dark:text-gray-400">`);
        {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`Manage MCP servers to extend ${escape_html(publicConfig.PUBLIC_APP_NAME)} with external tools.`);
        }
        $$renderer3.push(`<!--]--></p></div> `);
        {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div${attr_class(`mb-6 flex justify-between rounded-lg p-4 max-sm:flex-col max-sm:gap-4 sm:items-center ${stringify(!enabledCount() ? "bg-gray-100 dark:bg-white/5" : "bg-blue-50 dark:bg-blue-900/10")}`)}><div class="flex items-center gap-3"><div${attr_class("flex size-10 items-center justify-center rounded-xl bg-blue-500/10", void 0, { "grayscale": !enabledCount() })}>`);
          IconMCP($$renderer3, { classNames: "size-8 text-blue-600 dark:text-blue-500" });
          $$renderer3.push(`<!----></div> <div><p class="text-sm font-semibold text-gray-900 dark:text-gray-100">${escape_html(store_get($$store_subs ??= {}, "$allMcpServers", allMcpServers).length)}
							${escape_html(store_get($$store_subs ??= {}, "$allMcpServers", allMcpServers).length === 1 ? "server" : "servers")} configured</p> <p class="text-xs text-gray-600 dark:text-gray-400">${escape_html(enabledCount())} enabled</p></div></div> <div class="flex gap-2"><button${attr("disabled", isRefreshing, true)} class="btn gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">`);
          Renew($$renderer3, {
            class: `size-4 ${stringify("")}`
          });
          $$renderer3.push(`<!----> ${escape_html("Refresh")}</button> <button class="btn flex items-center gap-0.5 rounded-lg bg-blue-600 py-1.5 pl-2 pr-3 text-sm font-medium text-white hover:bg-blue-600">`);
          Add_large($$renderer3, { class: "size-4" });
          $$renderer3.push(`<!----> Add Server</button></div></div> <div class="space-y-5">`);
          if (baseServers().length > 0) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div><h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Base Servers (${escape_html(baseServers().length)})</h3> <div class="grid grid-cols-1 gap-3 md:grid-cols-2"><!--[-->`);
            const each_array = ensure_array_like(baseServers());
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let server = each_array[$$index];
              ServerCard($$renderer3, {
                server,
                isSelected: store_get($$store_subs ??= {}, "$selectedServerIds", selectedServerIds).has(server.id)
              });
            }
            $$renderer3.push(`<!--]--></div></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <div><h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Custom Servers (${escape_html(customServers().length)})</h3> `);
          if (customServers().length === 0) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 dark:border-gray-700">`);
            Hammer($$renderer3, { class: "mb-3 size-12 text-gray-400" });
            $$renderer3.push(`<!----> <p class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">No custom servers yet</p> <p class="mb-4 text-xs text-gray-600 dark:text-gray-400">Add your own MCP servers with custom tools</p> <button class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">`);
            Add_large($$renderer3, { class: "size-4" });
            $$renderer3.push(`<!----> Add Your First Server</button></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div class="grid grid-cols-1 gap-3 md:grid-cols-2"><!--[-->`);
            const each_array_1 = ensure_array_like(customServers());
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let server = each_array_1[$$index_1];
              ServerCard($$renderer3, {
                server,
                isSelected: store_get($$store_subs ??= {}, "$selectedServerIds", selectedServerIds).has(server.id)
              });
            }
            $$renderer3.push(`<!--]--></div>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-700"><h4 class="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">💡 Quick Tips</h4> <ul class="space-y-1 text-xs text-gray-600 dark:text-gray-400"><li>• Only connect to servers you trust</li> <li>• Enable servers to make their tools available in chat</li> <li>• Use the Health Check button to verify server connectivity</li> <li>• You can add HTTP headers for authentication when required</li></ul></div></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Chevron_left($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M10 16L20 6l1.4 1.4l-8.6 8.6l8.6 8.6L20 26z"/>`)}</svg>`);
}
function Caret_down($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="m24 12l-8 10l-8-10z"/>`)}</svg>`);
}
function Direction_right_01($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="m19 4l-1.414 1.414L22.172 10H10a2 2 0 0 0-2 2v16h2V12h12.172l-4.586 4.586L19 18l7-7Z"/>`)}</svg>`);
}
function Arrow_up($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12l7-7l7 7m-7 7V5"/>`)}</svg>`);
}
function Mic($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 19v3m7-12v2a7 7 0 0 1-14 0v-2"/><rect width="6" height="13" x="9" y="2" rx="3"/></g>`)}</svg>`);
}
function Menu_sub($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      open = false,
      onOpenChange = noop,
      onOpenChangeComplete = noop,
      children
    } = $$props;
    MenuSubmenuState.create({
      open: boxWith(() => open, (v) => {
        open = v;
        onOpenChange?.(v);
      }),
      onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
    });
    Floating_layer($$renderer2, {
      children: ($$renderer3) => {
        children?.($$renderer3);
        $$renderer3.push(`<!---->`);
      }
    });
    bind_props($$props, { open });
  });
}
function Menu_item($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      child,
      children,
      ref = null,
      id = createId(uid),
      disabled = false,
      onSelect = noop,
      closeOnSelect = true,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const itemState = MenuItemState.create({
      id: boxWith(() => id),
      disabled: boxWith(() => disabled),
      onSelect: boxWith(() => onSelect),
      ref: boxWith(() => ref, (v) => ref = v),
      closeOnSelect: boxWith(() => closeOnSelect)
    });
    const mergedProps = derived(() => mergeProps(restProps, itemState.props));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Menu_separator($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      ref = null,
      id = createId(uid),
      child,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const separatorState = MenuSeparatorState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, separatorState.props));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Menu_sub_content($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      ref = null,
      children,
      child,
      loop = true,
      onInteractOutside = noop,
      forceMount = false,
      onEscapeKeydown = noop,
      interactOutsideBehavior = "defer-otherwise-close",
      escapeKeydownBehavior = "defer-otherwise-close",
      onOpenAutoFocus: onOpenAutoFocusProp = noop,
      onCloseAutoFocus: onCloseAutoFocusProp = noop,
      onFocusOutside = noop,
      side = "right",
      trapFocus = false,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const subContentState = MenuContentState.create({
      id: boxWith(() => id),
      loop: boxWith(() => loop),
      ref: boxWith(() => ref, (v) => ref = v),
      isSub: true,
      onCloseAutoFocus: boxWith(() => handleCloseAutoFocus)
    });
    function onkeydown(e) {
      const isKeyDownInside = e.currentTarget.contains(e.target);
      const isCloseKey = SUB_CLOSE_KEYS[subContentState.parentMenu.root.opts.dir.current].includes(e.key);
      if (isKeyDownInside && isCloseKey) {
        subContentState.parentMenu.onClose();
        const triggerNode = subContentState.parentMenu.triggerNode;
        triggerNode?.focus();
        e.preventDefault();
      }
    }
    const dataAttr = derived(() => subContentState.parentMenu.root.getBitsAttr("sub-content"));
    const mergedProps = derived(() => mergeProps(restProps, subContentState.props, { side, onkeydown, [dataAttr()]: "" }));
    function handleOpenAutoFocus(e) {
      onOpenAutoFocusProp(e);
      if (e.defaultPrevented) return;
      e.preventDefault();
      if (subContentState.parentMenu.root.isUsingKeyboard && subContentState.parentMenu.contentNode) {
        MenuOpenEvent.dispatch(subContentState.parentMenu.contentNode);
      }
    }
    function handleCloseAutoFocus(e) {
      onCloseAutoFocusProp(e);
      if (e.defaultPrevented) return;
      e.preventDefault();
    }
    function handleInteractOutside(e) {
      onInteractOutside(e);
      if (e.defaultPrevented) return;
      subContentState.parentMenu.onClose();
    }
    function handleEscapeKeydown(e) {
      onEscapeKeydown(e);
      if (e.defaultPrevented) return;
      subContentState.parentMenu.onClose();
    }
    function handleOnFocusOutside(e) {
      onFocusOutside(e);
      if (e.defaultPrevented) return;
      if (!isHTMLElement(e.target)) return;
      if (e.target.id !== subContentState.parentMenu.triggerNode?.id) {
        subContentState.parentMenu.onClose();
      }
    }
    if (forceMount) {
      $$renderer2.push("<!--[0-->");
      {
        let popper = function($$renderer3, { props, wrapperProps }) {
          const finalProps = mergeProps(props, mergedProps(), { style: getFloatingContentCSSVars("menu") });
          if (child) {
            $$renderer3.push("<!--[0-->");
            child($$renderer3, {
              props: finalProps,
              wrapperProps,
              ...subContentState.snippetProps
            });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        };
        Popper_layer_force_mount($$renderer2, spread_props([
          mergedProps(),
          {
            ref: subContentState.opts.ref,
            interactOutsideBehavior,
            escapeKeydownBehavior,
            onOpenAutoFocus: handleOpenAutoFocus,
            enabled: subContentState.parentMenu.opts.open.current,
            onInteractOutside: handleInteractOutside,
            onEscapeKeydown: handleEscapeKeydown,
            onFocusOutside: handleOnFocusOutside,
            preventScroll: false,
            loop,
            trapFocus,
            shouldRender: subContentState.shouldRender,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else if (!forceMount) {
      $$renderer2.push("<!--[1-->");
      {
        let popper = function($$renderer3, { props, wrapperProps }) {
          const finalProps = mergeProps(props, mergedProps(), { style: getFloatingContentCSSVars("menu") });
          if (child) {
            $$renderer3.push("<!--[0-->");
            child($$renderer3, {
              props: finalProps,
              wrapperProps,
              ...subContentState.snippetProps
            });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        };
        Popper_layer($$renderer2, spread_props([
          mergedProps(),
          {
            ref: subContentState.opts.ref,
            interactOutsideBehavior,
            escapeKeydownBehavior,
            onCloseAutoFocus: handleCloseAutoFocus,
            onOpenAutoFocus: handleOpenAutoFocus,
            open: subContentState.parentMenu.opts.open.current,
            onInteractOutside: handleInteractOutside,
            onEscapeKeydown: handleEscapeKeydown,
            onFocusOutside: handleOnFocusOutside,
            preventScroll: false,
            loop,
            trapFocus,
            shouldRender: subContentState.shouldRender,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Menu_sub_trigger($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      disabled = false,
      ref = null,
      children,
      child,
      onSelect = noop,
      openDelay = 100,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const subTriggerState = MenuSubTriggerState.create({
      disabled: boxWith(() => disabled),
      onSelect: boxWith(() => onSelect),
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v),
      openDelay: boxWith(() => openDelay)
    });
    const mergedProps = derived(() => mergeProps(restProps, subTriggerState.props));
    Floating_layer_anchor($$renderer2, {
      id,
      ref: subTriggerState.opts.ref,
      children: ($$renderer3) => {
        if (child) {
          $$renderer3.push("<!--[0-->");
          child($$renderer3, { props: mergedProps() });
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div${attributes({ ...mergedProps() })}>`);
          children?.($$renderer3);
          $$renderer3.push(`<!----></div>`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
    bind_props($$props, { ref });
  });
}
function Menu_checkbox_item($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      child,
      children,
      ref = null,
      checked = false,
      id = createId(uid),
      onCheckedChange = noop,
      disabled = false,
      onSelect = noop,
      closeOnSelect = true,
      indeterminate = false,
      onIndeterminateChange = noop,
      value = "",
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const group = MenuCheckboxGroupContext.getOr(null);
    if (group && value) {
      if (group.opts.value.current.includes(value)) {
        checked = true;
      } else {
        checked = false;
      }
    }
    watch.pre(() => value, () => {
      if (group && value) {
        if (group.opts.value.current.includes(value)) {
          checked = true;
        } else {
          checked = false;
        }
      }
    });
    const checkboxItemState = MenuCheckboxItemState.create(
      {
        checked: boxWith(() => checked, (v) => {
          if (v !== checked) {
            checked = v;
            onCheckedChange(v);
          }
        }),
        id: boxWith(() => id),
        disabled: boxWith(() => disabled),
        onSelect: boxWith(() => handleSelect),
        ref: boxWith(() => ref, (v) => ref = v),
        closeOnSelect: boxWith(() => closeOnSelect),
        indeterminate: boxWith(() => indeterminate, (v) => {
          if (v !== indeterminate) {
            indeterminate = v;
            onIndeterminateChange(v);
          }
        }),
        value: boxWith(() => value)
      },
      group
    );
    function handleSelect(e) {
      onSelect(e);
      if (e.defaultPrevented) return;
      checkboxItemState.toggleChecked();
    }
    const mergedProps = derived(() => mergeProps(restProps, checkboxItemState.props));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { checked, indeterminate, props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2, { checked, indeterminate });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref, checked, indeterminate });
  });
}
function Menu($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      open = false,
      dir = "ltr",
      onOpenChange = noop,
      onOpenChangeComplete = noop,
      _internal_variant: variant = "dropdown-menu",
      children
    } = $$props;
    const root = MenuRootState.create({
      variant: boxWith(() => variant),
      dir: boxWith(() => dir),
      onClose: () => {
        open = false;
        onOpenChange(false);
      }
    });
    MenuMenuState.create(
      {
        open: boxWith(() => open, (v) => {
          open = v;
          onOpenChange(v);
        }),
        onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
      },
      root
    );
    Floating_layer($$renderer2, {
      children: ($$renderer3) => {
        children?.($$renderer3);
        $$renderer3.push(`<!---->`);
      }
    });
    bind_props($$props, { open });
  });
}
function Dropdown_menu_content($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      child,
      children,
      ref = null,
      loop = true,
      onInteractOutside = noop,
      onEscapeKeydown = noop,
      onCloseAutoFocus = noop,
      forceMount = false,
      trapFocus = false,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const contentState = MenuContentState.create({
      id: boxWith(() => id),
      loop: boxWith(() => loop),
      ref: boxWith(() => ref, (v) => ref = v),
      onCloseAutoFocus: boxWith(() => onCloseAutoFocus)
    });
    const mergedProps = derived(() => mergeProps(restProps, contentState.props));
    function handleInteractOutside(e) {
      contentState.handleInteractOutside(e);
      if (e.defaultPrevented) return;
      onInteractOutside(e);
      if (e.defaultPrevented) return;
      if (e.target && e.target instanceof Element) {
        const subContentSelector = `[${contentState.parentMenu.root.getBitsAttr("sub-content")}]`;
        if (e.target.closest(subContentSelector)) return;
      }
      contentState.parentMenu.onClose();
    }
    function handleEscapeKeydown(e) {
      onEscapeKeydown(e);
      if (e.defaultPrevented) return;
      contentState.parentMenu.onClose();
    }
    if (forceMount) {
      $$renderer2.push("<!--[0-->");
      {
        let popper = function($$renderer3, { props, wrapperProps }) {
          const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("dropdown-menu") });
          if (child) {
            $$renderer3.push("<!--[0-->");
            child($$renderer3, {
              props: finalProps,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        };
        Popper_layer_force_mount($$renderer2, spread_props([
          mergedProps(),
          contentState.popperProps,
          {
            ref: contentState.opts.ref,
            enabled: contentState.parentMenu.opts.open.current,
            onInteractOutside: handleInteractOutside,
            onEscapeKeydown: handleEscapeKeydown,
            trapFocus,
            loop,
            forceMount: true,
            id,
            shouldRender: contentState.shouldRender,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else if (!forceMount) {
      $$renderer2.push("<!--[1-->");
      {
        let popper = function($$renderer3, { props, wrapperProps }) {
          const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("dropdown-menu") });
          if (child) {
            $$renderer3.push("<!--[0-->");
            child($$renderer3, {
              props: finalProps,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        };
        Popper_layer($$renderer2, spread_props([
          mergedProps(),
          contentState.popperProps,
          {
            ref: contentState.opts.ref,
            open: contentState.parentMenu.opts.open.current,
            onInteractOutside: handleInteractOutside,
            onEscapeKeydown: handleEscapeKeydown,
            trapFocus,
            loop,
            forceMount: false,
            id,
            shouldRender: contentState.shouldRender,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Menu_trigger($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      ref = null,
      child,
      children,
      disabled = false,
      type = "button",
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const triggerState = DropdownMenuTriggerState.create({
      id: boxWith(() => id),
      disabled: boxWith(() => disabled ?? false),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
    Floating_layer_anchor($$renderer2, {
      id,
      ref: triggerState.opts.ref,
      children: ($$renderer3) => {
        if (child) {
          $$renderer3.push("<!--[0-->");
          child($$renderer3, { props: mergedProps() });
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<button${attributes({ ...mergedProps() })}>`);
          children?.($$renderer3);
          $$renderer3.push(`<!----></button>`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
    bind_props($$props, { ref });
  });
}
function Plus($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7v14"/>`)}</svg>`);
}
function Image($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M19 14a3 3 0 1 0-3-3a3 3 0 0 0 3 3m0-4a1 1 0 1 1-1 1a1 1 0 0 1 1-1"/><path fill="currentColor" d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 22H6v-6l5-5l5.59 5.59a2 2 0 0 0 2.82 0L21 19l5 5Zm0-4.83l-3.59-3.59a2 2 0 0 0-2.82 0L18 19.17l-5.59-5.59a2 2 0 0 0-2.82 0L6 17.17V6h20Z"/>`)}</svg>`);
}
function Document($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="m25.7 9.3l-7-7c-.2-.2-.4-.3-.7-.3H8c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-.3-.1-.5-.3-.7M18 4.4l5.6 5.6H18zM24 28H8V4h8v6c0 1.1.9 2 2 2h6z"/><path fill="currentColor" d="M10 22h12v2H10zm0-6h12v2H10z"/>`)}</svg>`);
}
function Upload($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="m6 18l1.41 1.41L15 11.83V30h2V11.83l7.59 7.58L26 18L16 8zM6 8V4h20v4h2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4z"/>`)}</svg>`);
}
function Link($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M29.25 6.76a6 6 0 0 0-8.5 0l1.42 1.42a4 4 0 1 1 5.67 5.67l-8 8a4 4 0 1 1-5.67-5.66l1.41-1.42l-1.41-1.42l-1.42 1.42a6 6 0 0 0 0 8.5A6 6 0 0 0 17 25a6 6 0 0 0 4.27-1.76l8-8a6 6 0 0 0-.02-8.48"/><path fill="currentColor" d="M4.19 24.82a4 4 0 0 1 0-5.67l8-8a4 4 0 0 1 5.67 0A3.94 3.94 0 0 1 19 14a4 4 0 0 1-1.17 2.85L15.71 19l1.42 1.42l2.12-2.12a6 6 0 0 0-8.51-8.51l-8 8a6 6 0 0 0 0 8.51A6 6 0 0 0 7 28a6.07 6.07 0 0 0 4.28-1.76l-1.42-1.42a4 4 0 0 1-5.67 0"/>`)}</svg>`);
}
function Chevron_right($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z"/>`)}</svg>`);
}
function UrlFetchModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = false, acceptMimeTypes = [], onclose, onfiles } = $$props;
    let urlValue = "";
    function close() {
      open = false;
      onclose?.();
    }
    if (open) {
      $$renderer2.push("<!--[0-->");
      {
        let children = function($$renderer3) {
          $$renderer3.push(`<form class="flex w-full flex-col gap-5 p-6"><div class="flex items-start justify-between"><h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Add from URL</h2> <button type="button" class="group" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-5 text-gray-700 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-400"><path d="M24 9.41 22.59 8 16 14.59 9.41 8 8 9.41 14.59 16 8 22.59 9.41 24 16 17.41 22.59 24 24 22.59 17.41 16 24 9.41z" fill="currentColor"></path></svg></button></div> <div class="flex flex-col gap-2"><label class="text-sm text-gray-600 dark:text-gray-400" for="fetch-url-input">Enter URL</label> <input id="fetch-url-input"${attr("value", urlValue)} type="url" placeholder="https://example.com/file.txt" class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[15px] text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-gray-700"${attr("aria-invalid", "false")}/></div> `);
          {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <p class="-mt-2 text-xs text-gray-500 dark:text-gray-400">Only HTTPS. Max 10MB.</p> <div class="flex items-center justify-end gap-2"><button type="button" class="inline-flex items-center rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">Cancel</button> <button type="submit" class="inline-flex items-center rounded-xl border border-gray-900 bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"${attr("disabled", urlValue.trim() === "", true)}>`);
          {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`Add`);
          }
          $$renderer3.push(`<!--]--></button></div></form>`);
        };
        Modal($$renderer2, {
          onclose: close,
          width: "w-[90dvh] md:w-[480px]",
          children
        });
      }
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { open });
  });
}
function isVirtualKeyboard() {
  return false;
}
function ChatInput($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      files = [],
      mimeTypes = [],
      value = "",
      placeholder = "",
      loading = false,
      disabled = false,
      modelIsMultimodal = false,
      modelSupportsTools = true,
      children,
      onPaste,
      focused = false,
      onsubmit
    } = $$props;
    let isUrlModalOpen = false;
    let isMcpManagerOpen = false;
    let isDropdownOpen = false;
    function openFilePickerText() {
      mimeTypes.filter((m) => !(m === "image/*" || m.startsWith("image/"))).join(",") || TEXT_MIME_ALLOWLIST.join(",");
    }
    function openFilePickerImage() {
      mimeTypes.filter((m) => m === "image/*" || m.startsWith("image/")).join(",") || IMAGE_MIME_ALLOWLIST_DEFAULT.join(",");
    }
    async function focusTextarea() {
      if (page.data.shared && page.data.loginEnabled && !page.data.user) return;
      return;
    }
    function handleFetchedFiles(newFiles) {
      if (!newFiles?.length) return;
      files = [...files, ...newFiles];
      queueMicrotask(async () => {
        await tick();
        void focusTextarea();
      });
    }
    let showFileUpload = derived(() => mimeTypes.length > 0);
    let showNoTools = derived(() => !showFileUpload());
    let selectedServers = derived(() => store_get($$store_subs ??= {}, "$allMcpServers", allMcpServers).filter((server) => store_get($$store_subs ??= {}, "$selectedServerIds", selectedServerIds).has(server.id)));
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="flex min-h-full flex-1 flex-col"><textarea rows="1" tabindex="0" inputmode="text"${attr_class("scrollbar-custom max-h-[4lh] w-full resize-none overflow-y-auto overflow-x-hidden border-0 bg-transparent px-2.5 py-2.5 outline-none focus:ring-0 focus-visible:ring-0 sm:px-3 md:max-h-[8lh]", void 0, { "text-gray-400": disabled })}${attr("placeholder", placeholder)}${attr("disabled", disabled, true)}>`);
      const $$body = escape_html(value);
      if ($$body) {
        $$renderer3.push(`${$$body}`);
      }
      $$renderer3.push(`</textarea> `);
      if (!showNoTools()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div${attr_class(clsx([
          "scrollbar-custom -ml-0.5 flex max-w-[calc(100%-40px)] flex-wrap items-center justify-start gap-2.5 px-3 pb-2.5 pt-1.5 text-gray-500 dark:text-gray-400 max-md:flex-nowrap max-md:overflow-x-auto sm:gap-2"
        ]))}>`);
        if (showFileUpload()) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="flex items-center"><input${attr("disabled", loading, true)} class="absolute hidden size-0" aria-label="Upload file" type="file" multiple=""${attr("accept", mimeTypes.join(","))}/> `);
          if (Menu) {
            $$renderer3.push("<!--[-->");
            Menu($$renderer3, {
              onOpenChange: (open) => {
                if (open && requireAuthUser()) {
                  isDropdownOpen = false;
                  return;
                }
                isDropdownOpen = open;
              },
              get open() {
                return isDropdownOpen;
              },
              set open($$value) {
                isDropdownOpen = $$value;
                $$settled = false;
              },
              children: ($$renderer4) => {
                if (Menu_trigger) {
                  $$renderer4.push("<!--[-->");
                  Menu_trigger($$renderer4, {
                    class: "btn size-8 rounded-full border bg-white text-black shadow transition-none enabled:hover:bg-white enabled:hover:shadow-inner dark:border-transparent dark:bg-gray-600/50 dark:text-white dark:hover:enabled:bg-gray-600 sm:size-7",
                    disabled: loading,
                    "aria-label": "Add attachment",
                    children: ($$renderer5) => {
                      Plus($$renderer5, { class: "text-base sm:text-sm" });
                    },
                    $$slots: { default: true }
                  });
                  $$renderer4.push("<!--]-->");
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push("<!--]-->");
                }
                $$renderer4.push(` `);
                if (Portal) {
                  $$renderer4.push("<!--[-->");
                  Portal($$renderer4, {
                    children: ($$renderer5) => {
                      if (Dropdown_menu_content) {
                        $$renderer5.push("<!--[-->");
                        Dropdown_menu_content($$renderer5, {
                          class: "z-50 rounded-xl border border-gray-200 bg-white/95 p-1 text-gray-800 shadow-lg backdrop-blur dark:border-gray-700/60 dark:bg-gray-800/95 dark:text-gray-100",
                          side: "top",
                          sideOffset: 8,
                          align: "start",
                          trapFocus: false,
                          onCloseAutoFocus: (e) => e.preventDefault(),
                          interactOutsideBehavior: "defer-otherwise-close",
                          children: ($$renderer6) => {
                            if (modelIsMultimodal) {
                              $$renderer6.push("<!--[0-->");
                              if (Menu_item) {
                                $$renderer6.push("<!--[-->");
                                Menu_item($$renderer6, {
                                  class: "flex h-9 select-none items-center gap-1 rounded-md px-2 text-sm text-gray-700 data-[highlighted]:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:data-[highlighted]:bg-white/10 sm:h-8",
                                  onSelect: () => openFilePickerImage(),
                                  children: ($$renderer7) => {
                                    Image($$renderer7, { class: "size-4 opacity-90 dark:opacity-80" });
                                    $$renderer7.push(`<!----> Add image(s)`);
                                  },
                                  $$slots: { default: true }
                                });
                                $$renderer6.push("<!--]-->");
                              } else {
                                $$renderer6.push("<!--[!-->");
                                $$renderer6.push("<!--]-->");
                              }
                            } else {
                              $$renderer6.push("<!--[-1-->");
                            }
                            $$renderer6.push(`<!--]--> `);
                            if (Menu_sub) {
                              $$renderer6.push("<!--[-->");
                              Menu_sub($$renderer6, {
                                children: ($$renderer7) => {
                                  if (Menu_sub_trigger) {
                                    $$renderer7.push("<!--[-->");
                                    Menu_sub_trigger($$renderer7, {
                                      class: "flex h-9 select-none items-center gap-1 rounded-md px-2 text-sm text-gray-700 data-[highlighted]:bg-gray-100 data-[state=open]:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:data-[highlighted]:bg-white/10 dark:data-[state=open]:bg-white/10 sm:h-8",
                                      children: ($$renderer8) => {
                                        $$renderer8.push(`<div class="flex items-center gap-1">`);
                                        Document($$renderer8, { class: "size-4 opacity-90 dark:opacity-80" });
                                        $$renderer8.push(`<!----> Add text file</div> <div class="ml-auto flex items-center">`);
                                        Chevron_right($$renderer8, { class: "size-4 opacity-70 dark:opacity-80" });
                                        $$renderer8.push(`<!----></div>`);
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer7.push("<!--]-->");
                                  } else {
                                    $$renderer7.push("<!--[!-->");
                                    $$renderer7.push("<!--]-->");
                                  }
                                  $$renderer7.push(` `);
                                  if (Menu_sub_content) {
                                    $$renderer7.push("<!--[-->");
                                    Menu_sub_content($$renderer7, {
                                      class: "z-50 rounded-xl border border-gray-200 bg-white/95 p-1 text-gray-800 shadow-lg backdrop-blur dark:border-gray-700/60 dark:bg-gray-800/95 dark:text-gray-100",
                                      sideOffset: 10,
                                      trapFocus: false,
                                      onCloseAutoFocus: (e) => e.preventDefault(),
                                      interactOutsideBehavior: "defer-otherwise-close",
                                      children: ($$renderer8) => {
                                        if (Menu_item) {
                                          $$renderer8.push("<!--[-->");
                                          Menu_item($$renderer8, {
                                            class: "flex h-9 select-none items-center gap-1 rounded-md px-2 text-sm text-gray-700 data-[highlighted]:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:data-[highlighted]:bg-white/10 sm:h-8",
                                            onSelect: () => openFilePickerText(),
                                            children: ($$renderer9) => {
                                              Upload($$renderer9, { class: "size-4 opacity-90 dark:opacity-80" });
                                              $$renderer9.push(`<!----> Upload from device`);
                                            },
                                            $$slots: { default: true }
                                          });
                                          $$renderer8.push("<!--]-->");
                                        } else {
                                          $$renderer8.push("<!--[!-->");
                                          $$renderer8.push("<!--]-->");
                                        }
                                        $$renderer8.push(` `);
                                        if (Menu_item) {
                                          $$renderer8.push("<!--[-->");
                                          Menu_item($$renderer8, {
                                            class: "flex h-9 select-none items-center gap-1 rounded-md px-2 text-sm text-gray-700 data-[highlighted]:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:data-[highlighted]:bg-white/10 sm:h-8",
                                            onSelect: () => isUrlModalOpen = true,
                                            children: ($$renderer9) => {
                                              Link($$renderer9, { class: "size-4 opacity-90 dark:opacity-80" });
                                              $$renderer9.push(`<!----> Fetch from URL`);
                                            },
                                            $$slots: { default: true }
                                          });
                                          $$renderer8.push("<!--]-->");
                                        } else {
                                          $$renderer8.push("<!--[!-->");
                                          $$renderer8.push("<!--]-->");
                                        }
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer7.push("<!--]-->");
                                  } else {
                                    $$renderer7.push("<!--[!-->");
                                    $$renderer7.push("<!--]-->");
                                  }
                                },
                                $$slots: { default: true }
                              });
                              $$renderer6.push("<!--]-->");
                            } else {
                              $$renderer6.push("<!--[!-->");
                              $$renderer6.push("<!--]-->");
                            }
                            $$renderer6.push(` `);
                            if (Menu_sub) {
                              $$renderer6.push("<!--[-->");
                              Menu_sub($$renderer6, {
                                children: ($$renderer7) => {
                                  if (Menu_sub_trigger) {
                                    $$renderer7.push("<!--[-->");
                                    Menu_sub_trigger($$renderer7, {
                                      class: "flex h-9 select-none items-center gap-1 rounded-md px-2 text-sm text-gray-700 data-[highlighted]:bg-gray-100 data-[state=open]:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:data-[highlighted]:bg-white/10 dark:data-[state=open]:bg-white/10 sm:h-8",
                                      children: ($$renderer8) => {
                                        $$renderer8.push(`<div class="flex items-center gap-1">`);
                                        IconMCP($$renderer8, { classNames: "size-4 opacity-90 dark:opacity-80" });
                                        $$renderer8.push(`<!----> MCP Servers</div> <div class="ml-auto flex items-center">`);
                                        Chevron_right($$renderer8, { class: "size-4 opacity-70 dark:opacity-80" });
                                        $$renderer8.push(`<!----></div>`);
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer7.push("<!--]-->");
                                  } else {
                                    $$renderer7.push("<!--[!-->");
                                    $$renderer7.push("<!--]-->");
                                  }
                                  $$renderer7.push(` `);
                                  if (Menu_sub_content) {
                                    $$renderer7.push("<!--[-->");
                                    Menu_sub_content($$renderer7, {
                                      class: "z-50 rounded-xl border border-gray-200 bg-white/95 p-1 text-gray-800 shadow-lg backdrop-blur dark:border-gray-700/60 dark:bg-gray-800/95 dark:text-gray-100",
                                      sideOffset: 10,
                                      trapFocus: false,
                                      onCloseAutoFocus: (e) => e.preventDefault(),
                                      interactOutsideBehavior: "defer-otherwise-close",
                                      children: ($$renderer8) => {
                                        $$renderer8.push(`<!--[-->`);
                                        const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$allMcpServers", allMcpServers));
                                        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                                          let server = each_array[$$index];
                                          {
                                            let children2 = function($$renderer9, { checked }) {
                                              $$renderer9.push(`<img${attr("src", getMcpServerFaviconUrl(server.url))} alt="" class="size-4 flex-shrink-0 rounded"/> <span class="max-w-52 truncate py-1">${escape_html(server.name)}</span> <div class="ml-auto flex items-center"><span${attr_class(clsx([
                                                "relative mt-px flex h-4 w-7 items-center self-center rounded-full transition-colors",
                                                checked ? "bg-blue-600/80" : "bg-gray-300 dark:bg-gray-700"
                                              ]))}><span${attr_class(clsx([
                                                "block size-3 translate-x-0.5 rounded-full bg-white shadow transition-transform",
                                                checked ? "translate-x-[14px]" : "translate-x-0.5"
                                              ]))}></span></span></div>`);
                                            };
                                            if (Menu_checkbox_item) {
                                              $$renderer8.push("<!--[-->");
                                              Menu_checkbox_item($$renderer8, {
                                                checked: store_get($$store_subs ??= {}, "$selectedServerIds", selectedServerIds).has(server.id),
                                                onCheckedChange: () => toggleServer(server.id),
                                                closeOnSelect: false,
                                                class: "flex h-9 select-none items-center gap-2 rounded-md px-2 text-sm leading-none text-gray-800 data-[highlighted]:bg-gray-100 focus-visible:outline-none dark:text-gray-100 dark:data-[highlighted]:bg-white/10",
                                                children: children2,
                                                $$slots: { default: true }
                                              });
                                              $$renderer8.push("<!--]-->");
                                            } else {
                                              $$renderer8.push("<!--[!-->");
                                              $$renderer8.push("<!--]-->");
                                            }
                                          }
                                        }
                                        $$renderer8.push(`<!--]--> `);
                                        if (store_get($$store_subs ??= {}, "$allMcpServers", allMcpServers).length > 0) {
                                          $$renderer8.push("<!--[0-->");
                                          if (Menu_separator) {
                                            $$renderer8.push("<!--[-->");
                                            Menu_separator($$renderer8, { class: "my-1 h-px bg-gray-200 dark:bg-gray-700/60" });
                                            $$renderer8.push("<!--]-->");
                                          } else {
                                            $$renderer8.push("<!--[!-->");
                                            $$renderer8.push("<!--]-->");
                                          }
                                        } else {
                                          $$renderer8.push("<!--[-1-->");
                                        }
                                        $$renderer8.push(`<!--]--> `);
                                        if (Menu_item) {
                                          $$renderer8.push("<!--[-->");
                                          Menu_item($$renderer8, {
                                            class: "flex h-9 select-none items-center gap-1 rounded-md px-2 text-sm text-gray-700 data-[highlighted]:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:data-[highlighted]:bg-white/10 sm:h-8",
                                            onSelect: () => isMcpManagerOpen = true,
                                            children: ($$renderer9) => {
                                              $$renderer9.push(`<!---->Manage MCP Servers`);
                                            },
                                            $$slots: { default: true }
                                          });
                                          $$renderer8.push("<!--]-->");
                                        } else {
                                          $$renderer8.push("<!--[!-->");
                                          $$renderer8.push("<!--]-->");
                                        }
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer7.push("<!--]-->");
                                  } else {
                                    $$renderer7.push("<!--[!-->");
                                    $$renderer7.push("<!--]-->");
                                  }
                                },
                                $$slots: { default: true }
                              });
                              $$renderer6.push("<!--]-->");
                            } else {
                              $$renderer6.push("<!--[!-->");
                              $$renderer6.push("<!--]-->");
                            }
                          },
                          $$slots: { default: true }
                        });
                        $$renderer5.push("<!--]-->");
                      } else {
                        $$renderer5.push("<!--[!-->");
                        $$renderer5.push("<!--]-->");
                      }
                    }
                  });
                  $$renderer4.push("<!--]-->");
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push("<!--]-->");
                }
              },
              $$slots: { default: true }
            });
            $$renderer3.push("<!--]-->");
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push("<!--]-->");
          }
          $$renderer3.push(` `);
          if (store_get($$store_subs ??= {}, "$enabledServersCount", enabledServersCount) > 0) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div${attr_class("ml-1.5 inline-flex h-8 items-center gap-1.5 rounded-full border border-blue-500/10 bg-blue-600/10 pl-2 pr-1 text-xs font-semibold text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 sm:h-7", void 0, {
              "grayscale": !modelSupportsTools,
              "opacity-60": !modelSupportsTools,
              "cursor-help": !modelSupportsTools
            })}${attr("title", modelSupportsTools ? "MCP servers enabled" : "Current model doesn’t support tools")}><button${attr_class("inline-flex cursor-pointer select-none items-center gap-1 bg-transparent p-0 leading-none text-current focus:outline-none", void 0, { "line-through": !modelSupportsTools })} type="button" title="Manage MCP Servers">`);
            if (selectedServers().length) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<span class="flex items-center -space-x-1"><!--[-->`);
              const each_array_1 = ensure_array_like(selectedServers().slice(0, 3));
              for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                let server = each_array_1[$$index_1];
                $$renderer3.push(`<img${attr("src", getMcpServerFaviconUrl(server.url))} alt="" class="size-4 rounded bg-white p-px shadow-sm ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10"/>`);
              }
              $$renderer3.push(`<!--]--> `);
              if (selectedServers().length > 3) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<span class="ml-1 text-[10px] font-semibold text-blue-800 dark:text-blue-200">+${escape_html(selectedServers().length - 3)}</span>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></span>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--> MCP (${escape_html(store_get($$store_subs ??= {}, "$enabledServersCount", enabledServersCount))})</button> <button class="grid size-5 place-items-center rounded-full bg-blue-600/15 text-blue-700 transition-colors hover:bg-blue-600/25 dark:bg-blue-600/25 dark:text-blue-300 dark:hover:bg-blue-600/35" aria-label="Disable all MCP servers" type="button">`);
            Close($$renderer3, { class: "size-3.5" });
            $$renderer3.push(`<!----></button></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      children?.($$renderer3);
      $$renderer3.push(`<!----> `);
      UrlFetchModal($$renderer3, {
        acceptMimeTypes: mimeTypes,
        onfiles: handleFetchedFiles,
        get open() {
          return isUrlModalOpen;
        },
        set open($$value) {
          isUrlModalOpen = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (isMcpManagerOpen) {
        $$renderer3.push("<!--[0-->");
        MCPServerManager($$renderer3, { onclose: () => isMcpManagerOpen = false });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { files, value, focused });
  });
}
function Loading($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path>`)}</svg>`);
}
function IconLoading($$renderer, $$props) {
  let { classNames = "" } = $$props;
  $$renderer.push(`<div${attr_class("inline-flex h-8 flex-none items-center gap-1 " + classNames)}><div class="h-1 w-1 flex-none animate-bounce rounded-full bg-gray-500 dark:bg-gray-400" style="animation-delay: 0.25s;"></div> <div class="h-1 w-1 flex-none animate-bounce rounded-full bg-gray-500 dark:bg-gray-400" style="animation-delay: 0.5s;"></div> <div class="h-1 w-1 flex-none animate-bounce rounded-full bg-gray-500 dark:bg-gray-400" style="animation-delay: 0.75s;"></div></div>`);
}
function Stop_filled_alt($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M24 6H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2"/>`)}</svg>`);
}
function StopGeneratingBtn($$renderer, $$props) {
  let { classNames = "", showBorder = false } = $$props;
  $$renderer.push(`<button type="button"${attr_class(`btn stop-generating-btn ${showBorder ? "stop-generating-btn--spinning" : ""} ${classNames}`, "svelte-c4jdoc")} aria-label="Stop generating"><span class="sr-only">Stop generating</span> `);
  Stop_filled_alt($$renderer, { class: "size-3.5 text-gray-500" });
  $$renderer.push(`<!----></button>`);
}
function Rotate_360($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path d="M25.95 7.65l.005-.004c-.092-.11-.197-.206-.293-.312c-.184-.205-.367-.41-.563-.603c-.139-.136-.286-.262-.43-.391c-.183-.165-.366-.329-.558-.482c-.16-.128-.325-.247-.49-.367c-.192-.14-.385-.277-.585-.406a13.513 13.513 0 0 0-.533-.324q-.308-.179-.625-.341c-.184-.094-.37-.185-.56-.27c-.222-.1-.449-.191-.678-.28c-.19-.072-.378-.145-.571-.208c-.246-.082-.498-.15-.75-.217c-.186-.049-.368-.102-.556-.143c-.29-.063-.587-.107-.883-.15c-.16-.023-.315-.056-.476-.073A12.933 12.933 0 0 0 6 7.703V4H4v8h8v-2H6.811A10.961 10.961 0 0 1 16 5a11.111 11.111 0 0 1 1.189.067c.136.015.268.042.403.061c.25.037.501.075.746.128c.16.035.315.08.472.121c.213.057.425.114.633.183c.164.054.325.116.486.178c.193.074.384.15.57.235c.162.072.32.15.477.23q.268.136.526.286c.153.09.305.18.453.276c.168.11.33.224.492.342c.14.102.282.203.417.312c.162.13.316.268.47.406c.123.11.248.217.365.332c.167.164.323.338.479.512A10.993 10.993 0 1 1 5 16H3a13 13 0 1 0 22.95-8.35z" fill="currentColor"/>`)}</svg>`);
}
function RetryBtn($$renderer, $$props) {
  let { classNames = "" } = $$props;
  $$renderer.push(`<button type="button"${attr_class(`btn flex h-7 rounded-lg border bg-white px-2 py-1 text-sm text-gray-500 shadow-sm hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 ${stringify(classNames)}`)}>`);
  Rotate_360($$renderer, { class: "mr-1 -translate-y-px text-[.65rem]" });
  $$renderer.push(`<!----> Retry</button>`);
}
const file2base64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
function Pen($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M27.307 6.107L30 3.414L28.586 2l-2.693 2.693L24.8 3.6a1.933 1.933 0 0 0-2.8 0l-18 18V28h6.4l18-18a1.933 1.933 0 0 0 0-2.8ZM9.6 26H6v-3.6L23.4 5L27 8.6ZM9 11.586L16.586 4L18 5.414L10.414 13z"/>`)}</svg>`);
}
function Document_blank($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"/>`)}</svg>`);
}
function Download($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10z"/>`)}</svg>`);
}
function Play($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M7 28a1 1 0 0 1-1-1V5a1 1 0 0 1 1.482-.876l20 11a1 1 0 0 1 0 1.752l-20 11A1 1 0 0 1 7 28M8 6.69v18.62L24.925 16Z"/>`)}</svg>`);
}
function AudioPlayer($$renderer, $$props) {
  let { src, name } = $$props;
  let time = 0;
  let duration = 0;
  function format(time2) {
    if (isNaN(time2)) return "...";
    const minutes = Math.floor(time2 / 60);
    const seconds = Math.floor(time2 % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }
  $$renderer.push(`<div class="flex h-14 w-72 items-center gap-4 rounded-2xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"><audio${attr("src", src)} preload="metadata"></audio> <button class="mx-auto my-auto aspect-square size-8 rounded-full border border-gray-400 bg-gray-100 dark:border-gray-800 dark:bg-gray-700"${attr("aria-label", "play")}>`);
  {
    $$renderer.push("<!--[0-->");
    Play($$renderer, { class: "mx-auto my-auto text-gray-600 dark:text-gray-300" });
  }
  $$renderer.push(`<!--]--></button> <div class="overflow-hidden"><div class="truncate font-medium">${escape_html(name)}</div> `);
  if (duration !== Infinity) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="flex items-center gap-2"><span class="text-xs">${escape_html(format(time))}</span> <div class="relative h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700" role="slider" aria-label="Seek"${attr("aria-valuenow", time)}${attr("aria-valuemin", 0)}${attr("aria-valuemax", duration)} tabindex="0"><div class="absolute inset-0 h-full bg-gray-400 dark:bg-gray-600"${attr_style(`width: ${stringify(time / duration * 100)}%`)}></div></div> <span class="text-xs">${escape_html("--:--")}</span></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div></div>`);
}
function UploadedFile($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { file, canClose = true, onclose } = $$props;
    let urlNotTrailing = page.url.pathname.replace(/\/$/, "");
    function truncateMiddle(text, maxLength) {
      if (text.length <= maxLength) {
        return text;
      }
      const halfLength = Math.floor((maxLength - 1) / 2);
      const start = text.substring(0, halfLength);
      const end = text.substring(text.length - halfLength);
      return `${start}…${end}`;
    }
    const isImage = (mime) => mime.startsWith("image/") || mime === "webp" || mime === "jpeg" || mime === "png";
    const isAudio = (mime) => mime.startsWith("audio/") || mime === "mp3" || mime === "wav" || mime === "x-wav";
    const isVideo = (mime) => mime.startsWith("video/") || mime === "mp4" || mime === "x-mpeg";
    function matchesAllowed(contentType, allowed) {
      const ct = contentType.split(";")[0]?.trim().toLowerCase();
      if (!ct) return false;
      const [ctType, ctSubtype] = ct.split("/");
      for (const a of allowed) {
        const [aType, aSubtype] = a.toLowerCase().split("/");
        const typeOk = aType === "*" || aType === ctType;
        const subOk = aSubtype === "*" || aSubtype === ctSubtype;
        if (typeOk && subOk) return true;
      }
      return false;
    }
    const isPlainText = (mime) => mime === "application/vnd.chatui.clipboard" || matchesAllowed(mime, TEXT_MIME_ALLOWLIST);
    let isClickable = derived(() => isImage(file.mime) || isPlainText(file.mime));
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div role="button" tabindex="0"${attr_class("", void 0, { "clickable": isClickable() })}><div class="group relative flex items-center rounded-xl shadow-sm">`);
    if (isImage(file.mime)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="h-36 overflow-hidden rounded-xl"><img${attr("src", file.type === "base64" ? `data:${file.mime};base64,${file.value}` : urlNotTrailing + "/output/" + file.value)}${attr("alt", file.name)} class="h-36 bg-gray-200 object-cover dark:bg-gray-800"/></div>`);
    } else if (isAudio(file.mime)) {
      $$renderer2.push("<!--[1-->");
      AudioPlayer($$renderer2, {
        src: file.type === "base64" ? `data:${file.mime};base64,${file.value}` : urlNotTrailing + "/output/" + file.value,
        name: truncateMiddle(file.name, 28)
      });
    } else if (isVideo(file.mime)) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div class="border-1 w-72 overflow-clip rounded-xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"><video${attr("src", file.type === "base64" ? `data:${file.mime};base64,${file.value}` : urlNotTrailing + "/output/" + file.value)} controls=""></video></div>`);
    } else if (isPlainText(file.mime)) {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<div${attr_class("flex h-14 w-64 items-center gap-2 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 2xl:w-72", void 0, { "file-hoverable": isClickable() })}><div class="grid size-10 flex-none place-items-center rounded-lg bg-gray-100 dark:bg-gray-800">`);
      Document($$renderer2, { class: "text-base text-gray-700 dark:text-gray-300" });
      $$renderer2.push(`<!----></div> <dl class="flex flex-col items-start truncate leading-tight"><dd class="text-sm">${escape_html(truncateMiddle(file.name, 28))}</dd> `);
      if (file.mime === "application/vnd.chatui.clipboard") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<dt class="text-xs text-gray-400">Clipboard source</dt>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<dt class="text-xs text-gray-400">${escape_html(file.mime)}</dt>`);
      }
      $$renderer2.push(`<!--]--></dl></div>`);
    } else if (file.mime === "application/octet-stream") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<div${attr_class("flex h-14 w-72 items-center gap-2 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900", void 0, { "file-hoverable": isClickable() })}><div class="grid size-10 flex-none place-items-center rounded-lg bg-gray-100 dark:bg-gray-800">`);
      Document_blank($$renderer2, { class: "text-base text-gray-700 dark:text-gray-300" });
      $$renderer2.push(`<!----></div> <dl class="flex flex-grow flex-col truncate leading-tight"><dd class="text-sm">${escape_html(truncateMiddle(file.name, 28))}</dd> <dt class="text-xs text-gray-400">File type could not be determined</dt></dl> <a${attr("href", file.type === "base64" ? `data:application/octet-stream;base64,${file.value}` : urlNotTrailing + "/output/" + file.value)}${attr("download", file.name)} class="ml-auto flex-none">`);
      Download($$renderer2, { class: "text-base text-gray-700 dark:text-gray-300" });
      $$renderer2.push(`<!----></a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attr_class("flex h-14 w-72 items-center gap-2 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900", void 0, { "file-hoverable": isClickable() })}><div class="grid size-10 flex-none place-items-center rounded-lg bg-gray-100 dark:bg-gray-800">`);
      Document_blank($$renderer2, { class: "text-base text-gray-700 dark:text-gray-300" });
      $$renderer2.push(`<!----></div> <dl class="flex flex-col items-start truncate leading-tight"><dd class="text-sm">${escape_html(truncateMiddle(file.name, 28))}</dd> <dt class="text-xs text-gray-400">${escape_html(file.mime)}</dt></dl></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (canClose) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button${attr_class("absolute -right-2 -top-2 z-10 grid size-6 place-items-center rounded-full border bg-black group-hover:visible dark:border-gray-700", void 0, { "invisible": navigator.maxTouchPoints === 0 })}>`);
      Close($$renderer2, { class: " text-xs  text-white" });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
const linkImagePattern = /(!?\[)([^\]]*?)$/;
const boldPattern = /(\*\*)([^*]*?)$/;
const italicPattern = /(__)([^_]*?)$/;
const boldItalicPattern = /(\*\*\*)([^*]*?)$/;
const singleAsteriskPattern = /(\*)([^*]*?)$/;
const singleUnderscorePattern = /(_)([^_]*?)$/;
const inlineCodePattern = /(`)([^`]*?)$/;
const strikethroughPattern = /(~~)([^~]*?)$/;
const hasCompleteCodeBlock = (text) => {
  const tripleBackticks = (text.match(/```/g) || []).length;
  return tripleBackticks > 0 && tripleBackticks % 2 === 0 && text.includes("\n");
};
const getOpenCodeFenceIndex = (text) => {
  let openFenceIndex = -1;
  let inFence = false;
  for (const match of text.matchAll(/```/g)) {
    const index = match.index ?? -1;
    if (index === -1) {
      continue;
    }
    if (inFence) {
      inFence = false;
      openFenceIndex = -1;
    } else {
      inFence = true;
      openFenceIndex = index;
    }
  }
  return openFenceIndex;
};
const handleIncompleteLinksAndImages = (text) => {
  const incompleteLinkUrlPattern = /(!?)\[([^\]]+)\]\(([^)]+)$/;
  const incompleteLinkUrlMatch = text.match(incompleteLinkUrlPattern);
  if (incompleteLinkUrlMatch) {
    const isImage = incompleteLinkUrlMatch[1] === "!";
    const linkText = incompleteLinkUrlMatch[2];
    const partialUrl = incompleteLinkUrlMatch[3];
    const matchStart = text.lastIndexOf(`${isImage ? "!" : ""}[${linkText}](${partialUrl}`);
    const beforeLink = text.substring(0, matchStart);
    if (isImage) {
      return beforeLink;
    }
    return `${beforeLink}[${linkText}](streamdown:incomplete-link)`;
  }
  const linkMatch = text.match(linkImagePattern);
  if (linkMatch) {
    const isImage = linkMatch[1].startsWith("!");
    if (isImage) {
      const startIndex = text.lastIndexOf(linkMatch[1]);
      return text.substring(0, startIndex);
    }
    return `${text}](streamdown:incomplete-link)`;
  }
  return text;
};
const handleIncompleteBold = (text) => {
  if (hasCompleteCodeBlock(text)) {
    return text;
  }
  const boldMatch = text.match(boldPattern);
  if (boldMatch) {
    const contentAfterMarker = boldMatch[2];
    if (!contentAfterMarker || /^[\s_~*`]*$/.test(contentAfterMarker)) {
      return text;
    }
    const markerIndex = text.lastIndexOf(boldMatch[1]);
    const openFenceIndex = getOpenCodeFenceIndex(text);
    if (openFenceIndex !== -1 && markerIndex > openFenceIndex) {
      return text;
    }
    const beforeMarker = text.substring(0, markerIndex);
    const lastNewlineBeforeMarker = beforeMarker.lastIndexOf("\n");
    const lineStart = lastNewlineBeforeMarker === -1 ? 0 : lastNewlineBeforeMarker + 1;
    const lineBeforeMarker = text.substring(lineStart, markerIndex);
    if (/^[\s]*[-*+][\s]+$/.test(lineBeforeMarker)) {
      const hasNewlineInContent = contentAfterMarker.includes("\n");
      if (hasNewlineInContent) {
        return text;
      }
    }
    const asteriskPairs = (text.match(/\*\*/g) || []).length;
    if (asteriskPairs % 2 === 1) {
      return `${text}**`;
    }
  }
  return text;
};
const handleIncompleteDoubleUnderscoreItalic = (text) => {
  if (hasCompleteCodeBlock(text)) {
    return text;
  }
  const italicMatch = text.match(italicPattern);
  if (italicMatch) {
    const contentAfterMarker = italicMatch[2];
    if (!contentAfterMarker || /^[\s_~*`]*$/.test(contentAfterMarker)) {
      return text;
    }
    const markerIndex = text.lastIndexOf(italicMatch[1]);
    const openFenceIndex = getOpenCodeFenceIndex(text);
    if (openFenceIndex !== -1 && markerIndex > openFenceIndex) {
      return text;
    }
    const beforeMarker = text.substring(0, markerIndex);
    const lastNewlineBeforeMarker = beforeMarker.lastIndexOf("\n");
    const lineStart = lastNewlineBeforeMarker === -1 ? 0 : lastNewlineBeforeMarker + 1;
    const lineBeforeMarker = text.substring(lineStart, markerIndex);
    if (/^[\s]*[-*+][\s]+$/.test(lineBeforeMarker)) {
      const hasNewlineInContent = contentAfterMarker.includes("\n");
      if (hasNewlineInContent) {
        return text;
      }
    }
    const underscorePairs = (text.match(/__/g) || []).length;
    if (underscorePairs % 2 === 1) {
      return `${text}__`;
    }
  }
  return text;
};
const countSingleAsterisks = (text) => {
  return text.split("").reduce((acc, char, index) => {
    if (char === "*") {
      const prevChar = text[index - 1];
      const nextChar = text[index + 1];
      if (prevChar === "\\") {
        return acc;
      }
      let lineStartIndex = index;
      for (let i = index - 1; i >= 0; i--) {
        if (text[i] === "\n") {
          lineStartIndex = i + 1;
          break;
        }
        if (i === 0) {
          lineStartIndex = 0;
          break;
        }
      }
      const beforeAsterisk = text.substring(lineStartIndex, index);
      if (beforeAsterisk.trim() === "" && (nextChar === " " || nextChar === "	")) {
        return acc;
      }
      if (prevChar !== "*" && nextChar !== "*") {
        return acc + 1;
      }
    }
    return acc;
  }, 0);
};
const handleIncompleteSingleAsteriskItalic = (text) => {
  if (hasCompleteCodeBlock(text)) {
    return text;
  }
  const singleAsteriskMatch = text.match(singleAsteriskPattern);
  if (singleAsteriskMatch) {
    let firstSingleAsteriskIndex = -1;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "*" && text[i - 1] !== "*" && text[i + 1] !== "*") {
        firstSingleAsteriskIndex = i;
        break;
      }
    }
    if (firstSingleAsteriskIndex === -1) {
      return text;
    }
    const openFenceIndex = getOpenCodeFenceIndex(text);
    if (openFenceIndex !== -1 && firstSingleAsteriskIndex > openFenceIndex) {
      return text;
    }
    const contentAfterFirstAsterisk = text.substring(firstSingleAsteriskIndex + 1);
    if (!contentAfterFirstAsterisk || /^[\s_~*`]*$/.test(contentAfterFirstAsterisk)) {
      return text;
    }
    const singleAsterisks = countSingleAsterisks(text);
    if (singleAsterisks % 2 === 1) {
      return `${text}*`;
    }
  }
  return text;
};
const isWithinMathBlock = (text, position) => {
  let inInlineMath = false;
  let inBlockMath = false;
  for (let i = 0; i < text.length && i < position; i++) {
    if (text[i] === "\\" && text[i + 1] === "$") {
      i++;
      continue;
    }
    if (text[i] === "$") {
      if (text[i + 1] === "$") {
        inBlockMath = !inBlockMath;
        i++;
        inInlineMath = false;
      } else if (!inBlockMath) {
        inInlineMath = !inInlineMath;
      }
    }
  }
  return inInlineMath || inBlockMath;
};
const countSingleUnderscores = (text) => {
  return text.split("").reduce((acc, char, index) => {
    if (char === "_") {
      const prevChar = text[index - 1];
      const nextChar = text[index + 1];
      if (prevChar === "\\") {
        return acc;
      }
      if (isWithinMathBlock(text, index)) {
        return acc;
      }
      if (prevChar && nextChar && /[\p{L}\p{N}_]/u.test(prevChar) && /[\p{L}\p{N}_]/u.test(nextChar)) {
        return acc;
      }
      if (prevChar !== "_" && nextChar !== "_") {
        return acc + 1;
      }
    }
    return acc;
  }, 0);
};
const handleIncompleteSingleUnderscoreItalic = (text) => {
  if (hasCompleteCodeBlock(text)) {
    return text;
  }
  const singleUnderscoreMatch = text.match(singleUnderscorePattern);
  if (singleUnderscoreMatch) {
    let firstSingleUnderscoreIndex = -1;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "_" && text[i - 1] !== "_" && text[i + 1] !== "_" && text[i - 1] !== "\\" && !isWithinMathBlock(text, i)) {
        const prevChar = i > 0 ? text[i - 1] : "";
        const nextChar = i < text.length - 1 ? text[i + 1] : "";
        if (prevChar && nextChar && /[\p{L}\p{N}_]/u.test(prevChar) && /[\p{L}\p{N}_]/u.test(nextChar)) {
          continue;
        }
        firstSingleUnderscoreIndex = i;
        break;
      }
    }
    if (firstSingleUnderscoreIndex === -1) {
      return text;
    }
    const openFenceIndex = getOpenCodeFenceIndex(text);
    if (openFenceIndex !== -1 && firstSingleUnderscoreIndex > openFenceIndex) {
      return text;
    }
    const contentAfterFirstUnderscore = text.substring(firstSingleUnderscoreIndex + 1);
    if (!contentAfterFirstUnderscore || /^[\s_~*`]*$/.test(contentAfterFirstUnderscore)) {
      return text;
    }
    const singleUnderscores = countSingleUnderscores(text);
    if (singleUnderscores % 2 === 1) {
      const trailingNewlineMatch = text.match(/\n+$/);
      if (trailingNewlineMatch) {
        const textBeforeNewlines = text.slice(0, -trailingNewlineMatch[0].length);
        return `${textBeforeNewlines}_${trailingNewlineMatch[0]}`;
      }
      return `${text}_`;
    }
  }
  return text;
};
const isPartOfTripleBacktick = (text, i) => {
  const isTripleStart = text.substring(i, i + 3) === "```";
  const isTripleMiddle = i > 0 && text.substring(i - 1, i + 2) === "```";
  const isTripleEnd = i > 1 && text.substring(i - 2, i + 1) === "```";
  return isTripleStart || isTripleMiddle || isTripleEnd;
};
const countSingleBackticks = (text) => {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "`" && !isPartOfTripleBacktick(text, i)) {
      count++;
    }
  }
  return count;
};
const handleIncompleteInlineCode = (text) => {
  const inlineTripleBacktickMatch = text.match(/^```[^`\n]*```?$/);
  if (inlineTripleBacktickMatch && !text.includes("\n")) {
    if (text.endsWith("``") && !text.endsWith("```")) {
      return `${text}\``;
    }
    return text;
  }
  const allTripleBackticks = (text.match(/```/g) || []).length;
  const insideIncompleteCodeBlock = allTripleBackticks % 2 === 1;
  if (allTripleBackticks > 0 && allTripleBackticks % 2 === 0 && text.includes("\n")) {
    return text;
  }
  if (text.endsWith("```\n") || text.endsWith("```")) {
    if (allTripleBackticks % 2 === 0) {
      return text;
    }
  }
  const inlineCodeMatch = text.match(inlineCodePattern);
  if (inlineCodeMatch && !insideIncompleteCodeBlock) {
    const contentAfterMarker = inlineCodeMatch[2];
    if (!contentAfterMarker || /^[\s_~*`]*$/.test(contentAfterMarker)) {
      return text;
    }
    const singleBacktickCount = countSingleBackticks(text);
    if (singleBacktickCount % 2 === 1) {
      return `${text}\``;
    }
  }
  return text;
};
const handleIncompleteStrikethrough = (text) => {
  const strikethroughMatch = text.match(strikethroughPattern);
  if (strikethroughMatch) {
    const contentAfterMarker = strikethroughMatch[2];
    if (!contentAfterMarker || /^[\s_~*`]*$/.test(contentAfterMarker)) {
      return text;
    }
    const tildePairs = (text.match(/~~/g) || []).length;
    if (tildePairs % 2 === 1) {
      return `${text}~~`;
    }
  }
  return text;
};
const handleIncompleteBlockKatex = (text) => {
  const dollarPairs = (text.match(/\$\$/g) || []).length;
  if (dollarPairs % 2 === 0) {
    return text;
  }
  const firstDollarIndex = text.indexOf("$$");
  const hasNewlineAfterStart = firstDollarIndex !== -1 && text.indexOf("\n", firstDollarIndex) !== -1;
  if (hasNewlineAfterStart && !text.endsWith("\n")) {
    return `${text}
$$`;
  }
  return `${text}$$`;
};
const countTripleAsterisks = (text) => {
  let count = 0;
  const matches = text.match(/\*+/g) || [];
  for (const match of matches) {
    const asteriskCount = match.length;
    if (asteriskCount >= 3) {
      count += Math.floor(asteriskCount / 3);
    }
  }
  return count;
};
const handleIncompleteBoldItalic = (text) => {
  if (hasCompleteCodeBlock(text)) {
    return text;
  }
  if (/^\*{4,}$/.test(text)) {
    return text;
  }
  const boldItalicMatch = text.match(boldItalicPattern);
  if (boldItalicMatch) {
    const contentAfterMarker = boldItalicMatch[2];
    if (!contentAfterMarker || /^[\s_~*`]*$/.test(contentAfterMarker)) {
      return text;
    }
    const markerIndex = text.lastIndexOf(boldItalicMatch[1]);
    const openFenceIndex = getOpenCodeFenceIndex(text);
    if (openFenceIndex !== -1 && markerIndex > openFenceIndex) {
      return text;
    }
    const tripleAsteriskCount = countTripleAsterisks(text);
    if (tripleAsteriskCount % 2 === 1) {
      return `${text}***`;
    }
  }
  return text;
};
const parseIncompleteMarkdown = (text) => {
  if (!text || typeof text !== "string") {
    return text;
  }
  let result = text;
  const processedResult = handleIncompleteLinksAndImages(result);
  if (processedResult.endsWith("](streamdown:incomplete-link)")) {
    return processedResult;
  }
  result = processedResult;
  result = handleIncompleteBoldItalic(result);
  result = handleIncompleteBold(result);
  result = handleIncompleteDoubleUnderscoreItalic(result);
  result = handleIncompleteSingleAsteriskItalic(result);
  result = handleIncompleteSingleUnderscoreItalic(result);
  result = handleIncompleteInlineCode(result);
  result = handleIncompleteStrikethrough(result);
  result = handleIncompleteBlockKatex(result);
  return result;
};
function parseMarkdownIntoBlocks(markdown) {
  const hasFootnoteReference = /\[\^[^\]\s]{1,200}\](?!:)/.test(markdown);
  const hasFootnoteDefinition = /\[\^[^\]\s]{1,200}\]:/.test(markdown);
  if (hasFootnoteReference || hasFootnoteDefinition) {
    return [markdown];
  }
  const tokens = Lexer.lex(markdown, { gfm: true });
  const mergedBlocks = [];
  const htmlStack = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const currentBlock = token.raw;
    if (htmlStack.length > 0) {
      mergedBlocks[mergedBlocks.length - 1] += currentBlock;
      if (token.type === "html") {
        const closingTagMatch = currentBlock.match(/<\/(\w+)>/);
        if (closingTagMatch) {
          const closingTag = closingTagMatch[1];
          if (htmlStack[htmlStack.length - 1] === closingTag) {
            htmlStack.pop();
          }
        }
      }
      continue;
    }
    if (token.type === "html" && token.block) {
      const openingTagMatch = currentBlock.match(/<(\w+)[\s>]/);
      if (openingTagMatch) {
        const tagName = openingTagMatch[1];
        const hasClosingTag = currentBlock.includes(`</${tagName}>`);
        if (!hasClosingTag) {
          htmlStack.push(tagName);
        }
      }
    }
    if (currentBlock.trim() === "$$" && mergedBlocks.length > 0) {
      const previousBlock = mergedBlocks.at(-1);
      if (!previousBlock) {
        mergedBlocks.push(currentBlock);
        continue;
      }
      const prevStartsWith$$ = previousBlock.trimStart().startsWith("$$");
      const prevDollarCount = (previousBlock.match(/\$\$/g) || []).length;
      if (prevStartsWith$$ && prevDollarCount % 2 === 1) {
        mergedBlocks[mergedBlocks.length - 1] = previousBlock + currentBlock;
        continue;
      }
    }
    if (mergedBlocks.length > 0 && currentBlock.trimEnd().endsWith("$$")) {
      const previousBlock = mergedBlocks.at(-1);
      if (!previousBlock) {
        mergedBlocks.push(currentBlock);
        continue;
      }
      const prevStartsWith$$ = previousBlock.trimStart().startsWith("$$");
      const prevDollarCount = (previousBlock.match(/\$\$/g) || []).length;
      const currDollarCount = (currentBlock.match(/\$\$/g) || []).length;
      if (prevStartsWith$$ && prevDollarCount % 2 === 1 && !currentBlock.trimStart().startsWith("$$") && currDollarCount === 1) {
        mergedBlocks[mergedBlocks.length - 1] = previousBlock + currentBlock;
        continue;
      }
    }
    mergedBlocks.push(currentBlock);
  }
  return mergedBlocks;
}
const bundledLanguages = [
  ["javascript", javascript],
  ["typescript", typescript],
  ["json", json],
  ["bash", bash],
  ["shell", shell],
  ["python", python],
  ["go", go],
  ["rust", rust],
  ["java", java],
  ["csharp", csharp],
  ["cpp", cpp],
  ["c", cLang],
  ["xml", xml],
  ["html", xml],
  ["css", css],
  ["scss", scss],
  ["markdown", markdownLang],
  ["yaml", yaml],
  ["sql", sql],
  ["plaintext", plaintext]
];
bundledLanguages.forEach(([name, language]) => hljs.registerLanguage(name, language));
const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|m4v)([?#]|$)/i;
const AUDIO_EXTENSIONS = /\.(mp3|wav|m4a|aac|flac)([?#]|$)/i;
function isVideoUrl(url) {
  return VIDEO_EXTENSIONS.test(url);
}
function isAudioUrl(url) {
  return AUDIO_EXTENSIONS.test(url);
}
const MULTIMEDIA_TAGS = /* @__PURE__ */ new Set(["video", "source", "audio"]);
const MULTIMEDIA_ALLOWED_ATTRS = /* @__PURE__ */ new Set([
  "src",
  "type",
  "controls",
  "autoplay",
  "loop",
  "muted",
  "playsinline",
  "poster",
  "width",
  "height",
  "preload"
]);
const MULTIMEDIA_BOOLEAN_ATTRS = /* @__PURE__ */ new Set(["controls", "autoplay", "loop", "muted", "playsinline"]);
const MULTIMEDIA_URI_ATTRS = /* @__PURE__ */ new Set(["src", "poster"]);
const MULTIMEDIA_ALLOWED_URI_PATTERN = /^(?!javascript:|data:text\/html)/i;
const MULTIMEDIA_HTML_REGEX = /<\/?(video|source|audio)\b/i;
const katexBlockExtension = {
  name: "katexBlock",
  level: "block",
  start(src) {
    const match = src.match(/(\${2}|\\\[)/);
    return match ? match.index : -1;
  },
  tokenizer(src) {
    const rule1 = /^\${2}([\s\S]+?)\${2}/;
    const match1 = rule1.exec(src);
    if (match1) {
      const token = {
        type: "katexBlock",
        raw: match1[0],
        text: match1[1].trim(),
        displayMode: true
      };
      return token;
    }
    const rule2 = /^\\\[([\s\S]+?)\\\]/;
    const match2 = rule2.exec(src);
    if (match2) {
      const token = {
        type: "katexBlock",
        raw: match2[0],
        text: match2[1].trim(),
        displayMode: true
      };
      return token;
    }
    return void 0;
  },
  renderer(token) {
    if (token.type === "katexBlock") {
      return katex.renderToString(token.text, {
        throwOnError: false,
        displayMode: token.displayMode
      });
    }
    return void 0;
  }
};
const katexInlineExtension = {
  name: "katexInline",
  level: "inline",
  start(src) {
    const match = src.match(/(\$|\\\()/);
    return match ? match.index : -1;
  },
  tokenizer(src) {
    const rule1 = /^\$([^$]+?)\$/;
    const match1 = rule1.exec(src);
    if (match1) {
      const token = {
        type: "katexInline",
        raw: match1[0],
        text: match1[1].trim(),
        displayMode: false
      };
      return token;
    }
    const rule2 = /^\\\(([\s\S]+?)\\\)/;
    const match2 = rule2.exec(src);
    if (match2) {
      const token = {
        type: "katexInline",
        raw: match2[0],
        text: match2[1].trim(),
        displayMode: false
      };
      return token;
    }
    return void 0;
  },
  renderer(token) {
    if (token.type === "katexInline") {
      return katex.renderToString(token.text, {
        throwOnError: false,
        displayMode: token.displayMode
      });
    }
    return void 0;
  }
};
function escapeHTML(content) {
  return content.replace(
    /[<>&"']/g,
    (x) => ({
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&#39;",
      '"': "&quot;"
    })[x] || x
  );
}
function addInlineCitations(md, webSearchSources = []) {
  const linkStyle = "color: rgb(59, 130, 246); text-decoration: none; hover:text-decoration: underline;";
  return md.replace(/\[(\d+)\]/g, (match) => {
    const indices = (match.match(/\d+/g) || []).map(Number);
    const links = indices.map((index) => {
      if (index === 0) return false;
      const source = webSearchSources[index - 1];
      if (source) {
        return `<a href="${escapeHTML(source.link)}" target="_blank" rel="noreferrer" style="${linkStyle}">${index}</a>`;
      }
      return "";
    }).filter(Boolean).join(", ");
    return links ? ` <sup>${links}</sup>` : match;
  });
}
function sanitizeHref(href) {
  if (!href) return void 0;
  const trimmed = href.trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:text/html")) {
    return void 0;
  }
  return trimmed.replace(/>$/, "");
}
function highlightCode(text, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(text, { language: lang, ignoreIllegals: true }).value;
    } catch {
    }
  }
  return hljs.highlightAuto(text).value;
}
function sanitizeMediaUrl(value) {
  const trimmed = value.trim().replace(/>$/, "");
  if (!MULTIMEDIA_ALLOWED_URI_PATTERN.test(trimmed)) return void 0;
  return trimmed;
}
function serializeMediaAttributes(attribs) {
  if (!attribs) return "";
  const parts = [];
  for (const [rawName, rawValue] of Object.entries(attribs)) {
    const name = rawName.toLowerCase();
    if (!MULTIMEDIA_ALLOWED_ATTRS.has(name)) continue;
    if (MULTIMEDIA_BOOLEAN_ATTRS.has(name)) {
      parts.push(name);
      continue;
    }
    let value = rawValue ?? "";
    if (MULTIMEDIA_URI_ATTRS.has(name)) {
      const safeUrl = sanitizeMediaUrl(value);
      if (!safeUrl) continue;
      value = safeUrl;
    }
    parts.push(`${name}="${escapeHTML(value)}"`);
  }
  return parts.length ? ` ${parts.join(" ")}` : "";
}
function serializeMediaNode(node, state) {
  if (node.type === "text") {
    return escapeHTML(node.data ?? "");
  }
  if (node.type === "tag" || node.type === "script" || node.type === "style") {
    const tagName = node.name?.toLowerCase() ?? "";
    if (!MULTIMEDIA_TAGS.has(tagName)) {
      state.hasDisallowedTag = true;
      return "";
    }
    const attrs = serializeMediaAttributes(node.attribs);
    if (tagName === "source") {
      return `<source${attrs}>`;
    }
    const children = (node.children ?? []).map((child) => serializeMediaNode(child, state)).join("");
    return `<${tagName}${attrs}>${children}</${tagName}>`;
  }
  if (node.type === "comment") {
    return "";
  }
  return "";
}
function sanitizeHtmlForMultimedia(html2) {
  if (!MULTIMEDIA_HTML_REGEX.test(html2)) {
    return escapeHTML(html2);
  }
  const document = parseDocument(html2, {
    lowerCaseAttributeNames: true,
    lowerCaseTags: true,
    recognizeSelfClosing: true
  });
  const state = { hasDisallowedTag: false };
  const sanitized = (document.children ?? []).map((child) => serializeMediaNode(child, state)).join("");
  if (state.hasDisallowedTag) {
    return escapeHTML(html2);
  }
  return sanitized;
}
function createMarkedInstance(sources) {
  return new Marked({
    hooks: {
      postprocess: (html2) => addInlineCitations(html2, sources)
    },
    extensions: [katexBlockExtension, katexInlineExtension],
    renderer: {
      link: (href, title, text) => {
        const safeHref = sanitizeHref(href);
        return safeHref ? `<a href="${escapeHTML(safeHref)}" target="_blank" rel="noreferrer">${text}</a>` : `<span>${escapeHTML(text ?? "")}</span>`;
      },
      image: (href, title, text) => {
        const safeHref = sanitizeHref(href);
        if (!safeHref) return `<span>${escapeHTML(text ?? "")}</span>`;
        const safeSrc = escapeHTML(safeHref);
        const safeTitle = title ? ` title="${escapeHTML(title)}"` : "";
        const safeAlt = escapeHTML(text ?? "");
        if (isVideoUrl(safeHref)) {
          return `<video controls${safeTitle}><source src="${safeSrc}">${safeAlt}</video>`;
        }
        if (isAudioUrl(safeHref)) {
          return `<audio controls${safeTitle}><source src="${safeSrc}">${safeAlt}</audio>`;
        }
        return `<img src="${safeSrc}" alt="${safeAlt}"${safeTitle} />`;
      },
      html: (html2) => sanitizeHtmlForMultimedia(html2)
    },
    gfm: true,
    breaks: true
  });
}
function isFencedBlockClosed(raw) {
  if (!raw) return true;
  const trimmed = raw.replace(/[\s\u0000]+$/, "");
  const openingFenceMatch = trimmed.match(/^([`~]{3,})/);
  if (!openingFenceMatch) {
    return true;
  }
  const fence = openingFenceMatch[1];
  const closingFencePattern = new RegExp(`(?:
|\r
)${fence}(?:[	 ]+)?$`);
  return closingFencePattern.test(trimmed);
}
const blockCache = /* @__PURE__ */ new Map();
function cacheKey(index, blockContent, sources) {
  const sourceKey = sources.map((s) => s.link).join("|");
  return `${index}-${hashString(blockContent)}|${sourceKey}`;
}
function processTokensSync(content, sources) {
  const processedContent = parseIncompleteMarkdown(content);
  const marked = createMarkedInstance(sources);
  const tokens = marked.lexer(processedContent);
  return tokens.map((token) => {
    if (token.type === "code") {
      return {
        type: "code",
        lang: token.lang,
        code: highlightCode(token.text, token.lang),
        rawCode: token.text,
        isClosed: isFencedBlockClosed(token.raw ?? "")
      };
    }
    return { type: "text", html: marked.parse(token.raw) };
  });
}
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
function processBlocksSync(content, sources = []) {
  const blocks = parseMarkdownIntoBlocks(content);
  return blocks.map((blockContent, index) => {
    const key = cacheKey(index, blockContent, sources);
    const cached = blockCache.get(key);
    if (cached) return cached;
    const tokens = processTokensSync(blockContent, sources);
    const block = {
      id: `${index}-${hashString(blockContent)}`,
      content: blockContent,
      tokens
    };
    blockCache.set(key, block);
    return block;
  });
}
function Play_filled_alt($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M7 28a1 1 0 0 1-1-1V5a1 1 0 0 1 1.482-.876l20 11a1 1 0 0 1 0 1.752l-20 11A1 1 0 0 1 7 28"/>`)}</svg>`);
}
function CodeBlock($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { code = "", rawCode = "", loading = false } = $$props;
    function hasStrictHtml5Doctype(input) {
      if (!input) return false;
      const withoutBOM = input.replace(/^\uFEFF/, "");
      const trimmed = withoutBOM.trimStart();
      return /^<!doctype\s+html\s*>/i.test(trimmed);
    }
    function isSvgDocument(input) {
      const trimmed = input.trimStart();
      return /^(?:<\?xml[^>]*>\s*)?(?:<!doctype\s+svg[^>]*>\s*)?<svg[\s>]/i.test(trimmed);
    }
    let showPreview = derived(() => hasStrictHtml5Doctype(rawCode) || isSvgDocument(rawCode));
    $$renderer2.push(`<div class="group relative my-4 rounded-lg"><div class="pointer-events-none sticky top-0 w-full"><div class="pointer-events-auto absolute right-2 top-2 flex items-center gap-1.5 md:right-3 md:top-3">`);
    if (showPreview()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="btn h-7 gap-1 rounded-lg border px-2 text-xs shadow-sm backdrop-blur transition-none hover:border-gray-500 active:shadow-inner disabled:cursor-not-allowed disabled:opacity-80 dark:border-gray-600 dark:bg-gray-600/50 dark:hover:border-gray-500"${attr("disabled", loading, true)} title="Preview HTML" aria-label="Preview HTML">`);
      if (loading) {
        $$renderer2.push("<!--[0-->");
        Loading($$renderer2, { class: "size-3.5" });
      } else {
        $$renderer2.push("<!--[-1-->");
        Play_filled_alt($$renderer2, { class: "size-3.5" });
      }
      $$renderer2.push(`<!--]--> Preview</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    CopyToClipBoardBtn($$renderer2, {
      iconClassNames: "size-3",
      classNames: "btn transition-none rounded-lg border size-7 text-sm shadow-sm dark:bg-gray-600/50 backdrop-blur dark:hover:border-gray-500  active:shadow-inner dark:border-gray-600  hover:border-gray-500",
      value: rawCode
    });
    $$renderer2.push(`<!----></div></div> <pre class="scrollbar-custom overflow-auto px-5 font-mono transition-[height]"><code>${html(DOMPurify.sanitize(code))}</code></pre> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function MarkdownBlock($$renderer, $$props) {
  let { tokens, loading = false } = $$props;
  const renderedTokens = derived(() => tokens);
  $$renderer.push(`<!--[-->`);
  const each_array = ensure_array_like(renderedTokens());
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let token = each_array[$$index];
    if (token.type === "text") {
      $$renderer.push("<!--[0-->");
      $$renderer.push(`${html(token.html)}`);
    } else if (token.type === "code") {
      $$renderer.push("<!--[1-->");
      CodeBlock($$renderer, {
        code: token.code,
        rawCode: token.rawCode,
        loading: loading && !token.isClosed
      });
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]-->`);
  }
  $$renderer.push(`<!--]-->`);
}
function MarkdownRenderer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { content, sources = [], loading = false } = $$props;
    let syncBlocks = derived(() => processBlocksSync(content, sources));
    let blocks = derived(() => syncBlocks());
    let worker = null;
    onDestroy(() => {
      worker?.terminate();
      worker = null;
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(blocks());
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let block = each_array[index];
      MarkdownBlock($$renderer2, { tokens: block.tokens, loading });
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function BlockWrapper($$renderer, $$props) {
  let {
    icon: icon2,
    iconBg = "bg-gray-50 dark:bg-gray-800",
    iconRing = "ring-gray-100 dark:ring-gray-700",
    hasNext = false,
    loading = false,
    children
  } = $$props;
  $$renderer.push(`<div class="group flex gap-2 has-[+.prose]:mb-1.5 [.prose+&amp;]:mt-3"><div class="flex w-[22px] flex-shrink-0 flex-col items-center"><div${attr_class(`relative z-0 flex h-[22px] w-[22px] items-center justify-center rounded-md ring-1 ${stringify(iconBg)} ${stringify(iconRing)}`, "svelte-u4fcqf")}>`);
  icon2($$renderer);
  $$renderer.push(`<!----> `);
  if (loading) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<svg class="pointer-events-none absolute inset-0 h-[22px] w-[22px]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="21" height="21" rx="5.5" class="loading-path stroke-current text-purple-500/20 svelte-u4fcqf" stroke-width="1" fill="none"></rect></svg>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div> `);
  if (hasNext) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="my-1 w-px flex-1 bg-gray-200 dark:bg-gray-700"></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div> <div class="min-w-0 flex-1 pb-2 pt-px">`);
  children($$renderer);
  $$renderer.push(`<!----></div></div>`);
}
function icon($$renderer) {
  $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path class="stroke-gray-500 dark:stroke-gray-400" style="stroke-width: 1.9; fill: none; stroke-linecap: round; stroke-linejoin: round;" d="M16 6v3.33M16 6c0-2.65 3.25-4.3 5.4-2.62 1.2.95 1.6 2.65.95 4.04a3.63 3.63 0 0 1 4.61.16 3.45 3.45 0 0 1 .46 4.37 5.32 5.32 0 0 1 1.87 4.75c-.22 1.66-1.39 3.6-3.07 4.14M16 6c0-2.65-3.25-4.3-5.4-2.62a3.37 3.37 0 0 0-.95 4.04 3.65 3.65 0 0 0-4.6.16 3.37 3.37 0 0 0-.49 4.27 5.57 5.57 0 0 0-1.85 4.85 5.3 5.3 0 0 0 3.07 4.15M16 9.33v17.34m0-17.34c0 2.18 1.82 4 4 4m6.22 7.5c.67 1.3.56 2.91-.27 4.11a4.05 4.05 0 0 1-4.62 1.5c0 1.53-1.05 2.9-2.66 2.9A2.7 2.7 0 0 1 16 26.66m10.22-5.83a4.05 4.05 0 0 0-3.55-2.17m-16.9 2.18a4.05 4.05 0 0 0 .28 4.1c1 1.44 2.92 2.09 4.59 1.5 0 1.52 1.12 2.88 2.7 2.88A2.7 2.7 0 0 0 16 26.67M5.78 20.85a4.04 4.04 0 0 1 3.55-2.18"></path></svg>`);
}
function OpenReasoningResults($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { content, loading = false, hasNext = false } = $$props;
    BlockWrapper($$renderer2, {
      // Track loading transitions to auto-expand/collapse
      // Auto-expand on first render if already loading
      // Loading started - auto-expand
      // Loading finished - auto-collapse
      icon,
      hasNext,
      iconBg: "bg-gray-100 dark:bg-gray-700",
      iconRing: "ring-gray-200 dark:ring-gray-600",
      children: ($$renderer3) => {
        $$renderer3.push(`<button type="button"${attr_class(`group/text ${stringify("line-clamp-2")} w-full cursor-pointer text-left`)}>`);
        {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div${attr_class("line-clamp-2 max-h-[3.25em] text-sm leading-relaxed text-gray-500 dark:text-gray-400", void 0, { "animate-pulse": loading })}>${escape_html(content.replace(/[#*`~[\]]/g, "").replace(/\n+/g, " ").trim())}</div>`);
        }
        $$renderer3.push(`<!--]--></button>`);
      }
    });
  });
}
function Alternatives($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      message,
      alternatives = [],
      loading = false,
      classNames = "",
      onshowAlternateMsg
    } = $$props;
    let currentIdx = derived(() => alternatives.findIndex((id) => id === message.id));
    $$renderer2.push(`<div${attr_class(`font-white group/navbranch z-0 flex h-6 w-fit select-none items-center justify-center gap-1 whitespace-nowrap text-sm ${stringify(
      // API client removed as deletion UI is commented out
      classNames
    )}`)}><button class="inline text-lg font-thin text-gray-400 hover:text-gray-800 disabled:pointer-events-none disabled:opacity-25 dark:text-gray-500 dark:hover:text-gray-200"${attr("disabled", currentIdx() === 0 || loading, true)}>`);
    Chevron_left($$renderer2, { class: "text-sm" });
    $$renderer2.push(`<!----></button> <span class="text-gray-400 dark:text-gray-500">${escape_html(currentIdx() + 1)} / ${escape_html(alternatives.length)}</span> <button class="inline text-lg font-thin text-gray-400 hover:text-gray-800 disabled:pointer-events-none disabled:opacity-25 dark:text-gray-500 dark:hover:text-gray-200"${attr("disabled", currentIdx() === alternatives.length - 1 || loading, true)}>`);
    Chevron_right($$renderer2, { class: "text-sm" });
    $$renderer2.push(`<!----></button></div>`);
  });
}
function MessageAvatar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { classNames = "" } = $$props;
    onDestroy(() => {
    });
    $$renderer2.push(`<svg${attr_class(clsx(classNames))} id="ball" width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Ball mask"><g clip-path="url(#a)"><path d="M12 6A6 6 0 1 0 0 6a6 6 0 0 0 12 0Z" fill="#fff"></path><mask id="b" style="mask-type:luminance" x="0" y="0" width="12" height="12"><path d="M12 6A6 6 0 1 0 0 6a6 6 0 0 0 12 0Z" fill="#fff"></path></mask><g filter="url(#c)" mask="url(#b)"><path id="blob" fill="#000" d="M11 1 L8 -4 L3 -8 L-6 6 L3 12 L7 11 L6 2 L11 1 Z"><animate attributeName="d" begin="indefinite" end="indefinite" dur="3.2s" repeatCount="indefinite" fill="remove" calcMode="spline" keyTimes="0; .33; .66; .9; 1" keySplines="
            .4 0 .2 1;
            .4 0 .2 1;
            .4 0 .2 1;
            .4 0 .2 1" values="
            M11 1 L8 -4 L3 -8 L-6 6 L3 12 L7 11 L6 2 L11 1 Z;
            M11 1 L8 -4 L3 -8 L-6 6 L3 12 L5 9  L7 4  L11 1 Z;
            M11 1 L8 -4 L3 -8 L-6 6 L3 12 L3 6  L5 1  L11 1 Z;
            M11 1 L8 -4 L3 -8 L-6 6 L3 12 L5 9  L7 4  L11 1 Z;
            M11 1 L8 -4 L3 -8 L-6 6 L3 12 L7 11 L6 2 L11 1 Z"></animate></path></g></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h12v12H0z"></path></clipPath><filter id="c" x="-9.4" y="-10.8" width="23.8" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="1.6"></feGaussianBlur></filter></defs></svg>`);
  });
}
function formatToolProgressLabel(progress) {
  if (!progress) return "";
  const total = typeof progress.total === "number" ? `/${progress.total}` : "";
  const value = `${progress.progress}${total}`;
  if (progress.message && progress.message.trim().length > 0) {
    return `${progress.message} (${value})`;
  }
  return `Progress: ${value}`;
}
function ToolUpdate($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { tool, loading = false, hasNext = false } = $$props;
    let toolFnName = derived(() => tool.find(isMessageToolCallUpdate)?.call.name);
    let toolError = derived(() => tool.some(isMessageToolErrorUpdate));
    let toolDone = derived(() => tool.some(isMessageToolResultUpdate));
    let isExecuting = derived(() => !toolDone() && !toolError() && loading);
    let toolSuccess = derived(() => toolDone() && !toolError());
    let toolProgress = derived(() => {
      for (let i = tool.length - 1; i >= 0; i -= 1) {
        const update = tool[i];
        if (isMessageToolProgressUpdate(update)) return update;
      }
      return void 0;
    });
    let progressLabel = derived(() => formatToolProgressLabel(toolProgress()));
    const availableTools = derived(() => page.data?.tools ?? []);
    let iconBg = derived(() => toolError() ? "bg-red-100 dark:bg-red-900/40" : "bg-purple-100 dark:bg-purple-900/40");
    let iconRing = derived(() => toolError() ? "ring-red-200 dark:ring-red-500/30" : "ring-purple-200 dark:ring-purple-500/30");
    function icon2($$renderer3) {
      if (toolSuccess()) {
        $$renderer3.push("<!--[0-->");
        Check($$renderer3, { class: "size-3.5 text-purple-600 dark:text-purple-400" });
      } else {
        $$renderer3.push("<!--[-1-->");
        Hammer($$renderer3, {
          class: `size-3.5 ${stringify(toolError() ? "text-red-500 dark:text-red-400" : "text-purple-600 dark:text-purple-400")}`
        });
      }
      $$renderer3.push(`<!--]-->`);
    }
    if (toolFnName()) {
      $$renderer2.push("<!--[0-->");
      BlockWrapper($$renderer2, {
        icon: icon2,
        iconBg: iconBg(),
        iconRing: iconRing(),
        hasNext,
        loading: isExecuting(),
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex w-full select-none items-center gap-2"><button type="button" class="flex flex-1 cursor-pointer flex-col items-start gap-1 text-left"><span${attr_class(`text-sm font-medium ${stringify(isExecuting() ? "text-purple-700 dark:text-purple-300" : toolError() ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300")}`)}>${escape_html(toolError() ? "Error calling" : toolDone() ? "Called" : "Calling")} tool <code class="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-500 opacity-90 dark:bg-gray-800 dark:text-gray-400">${escape_html(availableTools().find((entry) => entry.name === toolFnName())?.displayName ?? toolFnName())}</code></span> `);
          if (isExecuting() && toolProgress()) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span class="text-xs text-gray-500 dark:text-gray-400">${escape_html(progressLabel())}</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></button> <button type="button" class="cursor-pointer"${attr("aria-label", "Expand")}>`);
          Chevron_right($$renderer3, {
            class: `size-4 text-gray-400 transition-transform duration-200 ${stringify("")}`
          });
          $$renderer3.push(`<!----></button></div> `);
          {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function ChatMessage($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const publicConfig = usePublicConfig();
    let {
      message,
      loading = false,
      isAuthor: _isAuthor = true,
      readOnly: _readOnly = false,
      isTapped = false,
      alternatives = [],
      editMsdgId = null,
      isLast = false,
      onretry,
      onshowAlternateMsg
    } = $$props;
    let messageWidth = 0;
    let messageInfoWidth = 0;
    const THINK_BLOCK_REGEX = /(<think>[\s\S]*?(?:<\/think>|$))/gi;
    const THINK_BLOCK_TEST_REGEX = /(<think>[\s\S]*?(?:<\/think>|$))/i;
    let hasClientThink = derived(() => message.content.split(THINK_BLOCK_REGEX).length > 1);
    let contentWithoutThink = derived(() => message.content.replace(THINK_BLOCK_REGEX, "").trim());
    let blocks = derived(() => {
      const updates = message.updates ?? [];
      const res = [];
      const hasTools = updates.some(isMessageToolUpdate);
      let contentCursor = 0;
      let sawFinalAnswer = false;
      if (!hasTools && updates.length === 0) {
        if (message.content) return [{ type: "text", content: message.content }];
        return [];
      }
      for (const update of updates) {
        if (update.type === MessageUpdateType.Stream) {
          const token = typeof update.token === "string" && update.token.length > 0 ? update.token : null;
          const len = token !== null ? token.length : update.len ?? 0;
          const chunk = token ?? (message.content ? message.content.slice(contentCursor, contentCursor + len) : "");
          contentCursor += len;
          if (!chunk) continue;
          const last = res.at(-1);
          if (last?.type === "text") last.content += chunk;
          else res.push({ type: "text", content: chunk });
        } else if (isMessageToolUpdate(update)) {
          const existingBlock = res.find((b) => b.type === "tool" && b.uuid === update.uuid);
          if (existingBlock) {
            existingBlock.updates.push(update);
          } else {
            res.push({ type: "tool", uuid: update.uuid, updates: [update] });
          }
        } else if (update.type === MessageUpdateType.FinalAnswer) {
          sawFinalAnswer = true;
          const finalText = update.text ?? "";
          const currentText = res.filter((b) => b.type === "text").map((b) => b.content).join("");
          let addedText = "";
          if (finalText.startsWith(currentText)) {
            addedText = finalText.slice(currentText.length);
          } else if (!currentText.endsWith(finalText)) {
            const needsGap = !/\n\n$/.test(currentText) && !/^\n/.test(finalText);
            addedText = (needsGap ? "\n\n" : "") + finalText;
          }
          if (addedText) {
            const last = res.at(-1);
            if (last?.type === "text") {
              last.content += addedText;
            } else {
              res.push({ type: "text", content: addedText });
            }
          }
        }
      }
      if (!sawFinalAnswer && message.content && contentCursor < message.content.length) {
        const remaining = message.content.slice(contentCursor);
        if (remaining.length > 0) {
          const last = res.at(-1);
          if (last?.type === "text") last.content += remaining;
          else res.push({ type: "text", content: remaining });
        }
      } else if (!res.some((b) => b.type === "text") && message.content) {
        res.push({ type: "text", content: message.content });
      }
      return res;
    });
    let editMode = derived(() => editMsdgId === message.id);
    if (message.from === "assistant") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`group relative -mb-4 flex w-fit max-w-full items-start justify-start gap-4 pb-4 leading-relaxed max-sm:mb-1 ${stringify(message.routerMetadata && messageInfoWidth >= messageWidth ? "mb-1" : "")}`)}${attr("data-message-id", message.id)} data-message-role="assistant" role="presentation">`);
      MessageAvatar($$renderer2, {
        classNames: "mt-5 size-3.5 flex-none select-none rounded-full shadow-lg max-sm:hidden"
      });
      $$renderer2.push(`<!----> <div class="relative flex min-w-[60px] flex-col gap-2 break-words rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 px-5 py-3.5 text-gray-600 prose-pre:my-2 dark:border-gray-800 dark:from-gray-800/80 dark:text-gray-300">`);
      if (message.files?.length) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="flex h-fit flex-wrap gap-x-5 gap-y-2"><!--[-->`);
        const each_array = ensure_array_like(message.files);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let file = each_array[$$index];
          UploadedFile($$renderer2, { file, canClose: false });
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div>`);
      if (isLast && loading && blocks().length === 0) {
        $$renderer2.push("<!--[0-->");
        IconLoading($$renderer2, { classNames: "loading inline ml-2 first:ml-0" });
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_1 = ensure_array_like(blocks());
      for (let blockIndex = 0, $$length = each_array_1.length; blockIndex < $$length; blockIndex++) {
        let block = each_array_1[blockIndex];
        const nextBlock = blocks()[blockIndex + 1];
        const nextBlockHasThink = nextBlock?.type === "text" && THINK_BLOCK_TEST_REGEX.test(nextBlock.content);
        const nextIsLinkable = nextBlock?.type === "tool" || nextBlockHasThink;
        if (block.type === "tool") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div data-exclude-from-copy="" class="has-[+.prose]:mb-3 [.prose+&amp;]:mt-4">`);
          ToolUpdate($$renderer2, { tool: block.updates, loading, hasNext: nextIsLinkable });
          $$renderer2.push(`<!----></div>`);
        } else if (block.type === "text") {
          $$renderer2.push("<!--[1-->");
          if (isLast && loading && block.content.length === 0) {
            $$renderer2.push("<!--[0-->");
            IconLoading($$renderer2, { classNames: "loading inline ml-2 first:ml-0" });
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (hasClientThink()) {
            $$renderer2.push("<!--[0-->");
            const parts = block.content.split(THINK_BLOCK_REGEX);
            $$renderer2.push(`<!--[-->`);
            const each_array_2 = ensure_array_like(parts);
            for (let partIndex = 0, $$length2 = each_array_2.length; partIndex < $$length2; partIndex++) {
              let part = each_array_2[partIndex];
              const remainingParts = parts.slice(partIndex + 1);
              const hasMoreLinkable = remainingParts.some((p) => p && THINK_BLOCK_TEST_REGEX.test(p)) || nextIsLinkable;
              if (part && part.startsWith("<think>")) {
                $$renderer2.push("<!--[0-->");
                const isClosed = part.endsWith("</think>");
                const thinkContent = part.slice(7, isClosed ? -8 : void 0);
                OpenReasoningResults($$renderer2, {
                  content: thinkContent,
                  loading: isLast && loading && !isClosed,
                  hasNext: hasMoreLinkable
                });
              } else if (part && part.trim().length > 0) {
                $$renderer2.push("<!--[1-->");
                $$renderer2.push(`<div class="prose max-w-none dark:prose-invert prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-pre:bg-gray-800 prose-img:my-0 prose-img:cursor-pointer prose-img:rounded-lg dark:prose-pre:bg-gray-900">`);
                MarkdownRenderer($$renderer2, { content: part, loading: isLast && loading });
                $$renderer2.push(`<!----></div>`);
              } else {
                $$renderer2.push("<!--[-1-->");
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<div class="prose max-w-none dark:prose-invert prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-pre:bg-gray-800 prose-img:my-0 prose-img:cursor-pointer prose-img:rounded-lg dark:prose-pre:bg-gray-900">`);
            MarkdownRenderer($$renderer2, { content: block.content, loading: isLast && loading });
            $$renderer2.push(`<!----></div>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div></div> `);
      if (message.routerMetadata || !loading && message.content) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div${attr_class(`absolute -bottom-3.5 ${stringify(message.routerMetadata && messageInfoWidth > messageWidth ? "left-1 pl-1 lg:pl-7" : "right-1")} flex max-w-[calc(100dvw-40px)] items-center gap-0.5`)}>`);
        if (message.routerMetadata && (message.routerMetadata.route || message.routerMetadata.model || message.routerMetadata.provider) && (!isLast || !loading)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="mr-2 flex items-center gap-1.5 truncate whitespace-nowrap text-[.65rem] text-gray-400 dark:text-gray-400 sm:text-xs">`);
          if (message.routerMetadata.route && message.routerMetadata.model) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="truncate rounded bg-gray-100 px-1 font-mono dark:bg-gray-800 sm:py-px">${escape_html(message.routerMetadata.route)}</span> <span class="text-gray-500">with</span> `);
            if (publicConfig.isHuggingChat) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<a${attr("href", `/chat/settings/${stringify(message.routerMetadata.model)}`)} class="flex items-center gap-1 truncate rounded bg-gray-100 px-1 font-mono hover:text-gray-500 dark:bg-gray-800 dark:hover:text-gray-300 sm:py-px">${escape_html(message.routerMetadata.model.split("/").pop())}</a>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<span class="truncate rounded bg-gray-100 px-1.5 font-mono dark:bg-gray-800 sm:py-px">${escape_html(message.routerMetadata.model.split("/").pop())}</span>`);
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (message.routerMetadata.provider) {
            $$renderer2.push("<!--[0-->");
            const hubOrg = PROVIDERS_HUB_ORGS[message.routerMetadata.provider];
            $$renderer2.push(`<span class="text-gray-500 max-sm:hidden">via</span> <a target="_blank"${attr("href", `https://huggingface.co/${stringify(hubOrg)}`)} class="flex items-center gap-1 truncate rounded bg-gray-100 px-1 font-mono hover:text-gray-500 dark:bg-gray-800 dark:hover:text-gray-300 max-sm:hidden sm:py-px"><img${attr("src", `https://huggingface.co/api/avatars/${stringify(hubOrg)}`)}${attr("alt", `${stringify(message.routerMetadata.provider)} logo`)} class="size-2.5 flex-none rounded-sm" onerror="this.__e=event"/> ${escape_html(message.routerMetadata.provider)}</a>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (!isLast || !loading) {
          $$renderer2.push("<!--[0-->");
          CopyToClipBoardBtn($$renderer2, {
            onClick: () => {
            },
            classNames: "btn rounded-sm p-1 text-sm text-gray-400 hover:text-gray-500 focus:ring-0 dark:text-gray-400 dark:hover:text-gray-300",
            value: contentWithoutThink(),
            iconClassNames: "text-xs"
          });
          $$renderer2.push(`<!----> <button class="btn rounded-sm p-1 text-xs text-gray-400 hover:text-gray-500 focus:ring-0 dark:text-gray-400 dark:hover:text-gray-300" title="Retry" type="button">`);
          Rotate_360($$renderer2, {});
          $$renderer2.push(`<!----></button> `);
          if (alternatives.length > 1 && editMsdgId === null) {
            $$renderer2.push("<!--[0-->");
            Alternatives($$renderer2, {
              message,
              alternatives,
              loading,
              onshowAlternateMsg: (payload) => onshowAlternateMsg?.(payload)
            });
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (message.from === "user") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`group relative ${stringify(alternatives.length > 1 && editMsdgId === null ? "mb-7" : "")} w-full items-start justify-start gap-4`)}${attr("data-message-id", message.id)} data-message-type="user" role="presentation"><div class="flex w-full flex-col gap-2">`);
      if (message.files?.length) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="flex w-fit gap-4 px-5"><!--[-->`);
        const each_array_3 = ensure_array_like(message.files);
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let file = each_array_3[$$index_3];
          UploadedFile($$renderer2, { file, canClose: false });
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex w-full flex-row flex-nowrap">`);
      if (!editMode()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="disabled w-full appearance-none whitespace-break-spaces text-wrap break-words bg-inherit px-5 py-3.5 text-gray-500 dark:text-gray-400">${escape_html(message.content.trim())}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<form class="mt-3 flex w-full flex-col"><textarea class="w-full whitespace-break-spaces break-words rounded-xl bg-gray-100 px-5 py-3.5 text-gray-500 *:h-max focus:outline-none dark:bg-gray-800 dark:text-gray-400" rows="5" required="">`);
        const $$body = escape_html(message.content.trim());
        if ($$body) {
          $$renderer2.push(`${$$body}`);
        }
        $$renderer2.push(`</textarea> <div class="flex w-full flex-row flex-nowrap items-center justify-center gap-2 pt-2"><button type="submit"${attr_class(`btn rounded-lg px-3 py-1.5 text-sm ${stringify(loading ? "bg-gray-300 text-gray-400 dark:bg-gray-700 dark:text-gray-600" : "bg-gray-200 text-gray-600 hover:text-gray-800   focus:ring-0 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200")} `)}${attr("disabled", loading, true)}>Send</button> <button type="button" class="btn rounded-sm p-2 text-sm text-gray-400 hover:text-gray-500 focus:ring-0 dark:text-gray-400 dark:hover:text-gray-300">Cancel</button></div></form>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="absolute -bottom-4 ml-3.5 flex w-full gap-1.5">`);
      if (alternatives.length > 1 && editMsdgId === null) {
        $$renderer2.push("<!--[0-->");
        Alternatives($$renderer2, {
          message,
          alternatives,
          loading,
          onshowAlternateMsg: (payload) => onshowAlternateMsg?.(payload)
        });
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (alternatives.length > 1 && editMsdgId === null || !loading && !editMode()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="hidden cursor-pointer items-center gap-1 rounded-md border border-gray-200 px-1.5 py-0.5 text-xs text-gray-400 group-hover:flex hover:flex hover:text-gray-500 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-300 lg:-right-2" title="Edit" type="button">`);
        Pen($$renderer2, {});
        $$renderer2.push(`<!----> Edit</button> <button${attr_class(`hidden cursor-pointer items-center gap-1 rounded-md border border-gray-200 px-1.5 py-0.5 text-xs group-hover:flex hover:flex lg:-right-2 ${stringify("text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300")} dark:border-gray-700`)} title="Copy to clipboard" type="button">`);
        {
          $$renderer2.push("<!--[-1-->");
          Copy($$renderer2, { class: "scale-95" });
          $$renderer2.push(`<!----> Copy`);
        }
        $$renderer2.push(`<!--]--></button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { isTapped, editMsdgId });
  });
}
function ScrollToBottomBtn($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function ScrollToPreviousBtn($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    function destroy() {
    }
    onDestroy(destroy);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Blockchain($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M6 24H4V8h2ZM28 8h-2v16h2Zm-4-2V4H8v2Zm0 22v-2H8v2Z"/>`)}</svg>`);
}
function SystemPromptModal($$renderer, $$props) {
  $$renderer.push(`<button type="button" class="mx-auto flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">`);
  Blockchain($$renderer, { class: "text-xxs" });
  $$renderer.push(`<!----> Using Custom System Prompt</button> `);
  {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]-->`);
}
function ShareConversationModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = false, onclose } = $$props;
    let creating = false;
    function close() {
      open = false;
      onclose?.();
    }
    if (open) {
      $$renderer2.push("<!--[0-->");
      Modal($$renderer2, {
        onclose: close,
        width: "w-[90dvh] md:w-[500px]",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex w-full flex-col gap-3 p-5 sm:gap-5 sm:p-6">`);
          {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div class="flex items-start justify-between"><div class="text-xl font-semibold text-gray-800 dark:text-gray-200">Share public link to chat</div> <button type="button" class="group" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-5 text-gray-700 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-400"><path d="M24 9.41 22.59 8 16 14.59 9.41 8 8 9.41 14.59 16 8 22.59 9.41 24 16 17.41 22.59 24 24 22.59 17.41 16 24 9.41z" fill="currentColor"></path></svg></button></div> <div class="text-sm text-gray-600 dark:text-gray-400">Any messages you add after sharing stay private.</div>`);
          }
          $$renderer3.push(`<!--]--> `);
          {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <div class="flex h-12 items-center gap-2 whitespace-nowrap rounded-2xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800"><input class="w-full truncate bg-transparent text-[15px] text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-500 max-sm:text-sm" readonly=""${attr("value", `${page.data.publicConfig.PUBLIC_SHARE_PREFIX || `${page.data.publicConfig.PUBLIC_ORIGIN || page.url.origin}${base}`}/r/...`)}/> `);
          {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<button class="-mr-1 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600" type="button"${attr("disabled", creating, true)}>`);
            {
              $$renderer3.push("<!--[-1-->");
              Link($$renderer3, { class: "text-[1.05em]" });
              $$renderer3.push(`<!----> Create link`);
            }
            $$renderer3.push(`<!--]--></button>`);
          }
          $$renderer3.push(`<!--]--></div></div>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function ChatIntroduction($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const publicConfig = usePublicConfig();
    $$renderer2.push(`<div class="my-auto grid items-center justify-center gap-8 text-center"><div class="flex -translate-y-16 select-none items-center rounded-xl text-3xl font-semibold md:-translate-y-12 md:text-5xl">`);
    Logo($$renderer2, { classNames: "size-12 md:size-20 dark:invert mr-0.5" });
    $$renderer2.push(`<!----> ${escape_html(
      // referenced to appease linter while UI blocks are commented out
      publicConfig.PUBLIC_APP_NAME
    )}</div></div>`);
  });
}
function ModelSwitch($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { models, currentModel } = $$props;
    let selectedModelId = "";
    $$renderer2.push(`<div class="mx-auto mt-0 flex w-fit flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-500/20 p-4 dark:border-gray-800"><span>This model is no longer available. Switch to a new one to continue this conversation:</span> <div class="flex items-center space-x-2">`);
    $$renderer2.select(
      {
        value: selectedModelId,
        class: "rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-900 max-sm:max-w-32"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(models);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let model = each_array[$$index];
          $$renderer3.option({ value: model.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(model.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(` <button${attr("disabled", selectedModelId === currentModel.id, true)} class="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-900">Accept</button></div></div>`);
  });
}
const routerExamples = [
  {
    title: "HTML game",
    prompt: "Code a minimal Flappy Bird game using HTML and Canvas",
    followUps: [
      {
        title: "README.md file",
        prompt: "Create a comprehensive README.md for the Flappy Bird game project."
      },
      {
        title: "CRT Screen",
        prompt: "Add a CRT screen effect to the game"
      },
      {
        title: "Add power-ups",
        prompt: "Add collectible coins between pipes that award bonus points and a shield power-up that allows one collision."
      },
      {
        title: "Explain collision detection",
        prompt: "Explain the collision detection algorithm for the bird and pipes in simple terms with examples."
      }
    ]
  },
  {
    title: "Weird painting",
    prompt: "is this a real painting?",
    attachments: [
      {
        src: "huggingchat/castle-example.jpg"
      }
    ]
  },
  {
    title: "Landing page",
    prompt: "Build a responsive SaaS landing page for my AI coding assitant using Tailwind CSS. With a hero, features, testimonials, and pricing sections.",
    followUps: [
      {
        title: "Dark mode",
        prompt: "Add dark mode and make it the default"
      },
      {
        title: "Write blog post",
        prompt: "Write a blog post introducing my service."
      },
      {
        title: "Translate to Italian",
        prompt: "Translate only the text content displayed to users into Italian."
      },
      {
        title: "Architecture review",
        prompt: "Review the architecture and suggest improvements for scalability, SEO optimization, and performance."
      }
    ]
  },
  {
    title: "Eminem song",
    prompt: "Write an Eminem-style rap battling AI taking over hip-hop, with two energetic verses and a catchy hook.",
    followUps: [
      {
        title: "Psychological analysis",
        prompt: "Provide a psychological analysis of Eminem's emotions in this song."
      },
      {
        title: "Wired Article",
        prompt: "Write an article in the style of Wired explaining this Eminem release."
      },
      {
        title: "Roleplay",
        prompt: "Roleplay as Eminem so I can discuss the song with him."
      },
      {
        title: "Translate to Spanish",
        prompt: "Translate the rap lyrics to Spanish while maintaining the rhyme scheme and flow."
      }
    ]
  },
  {
    title: "Act as Yoda",
    prompt: "Act as Yoda",
    followUps: [
      {
        title: "Give advice",
        prompt: "Continue acting as Yoda and offer three pieces of life advice for staying focused under pressure."
      },
      {
        title: "Explain the Force",
        prompt: "In Yoda's voice, explain the concept of the Force to a young padawan using modern language."
      },
      {
        title: "Plain English",
        prompt: "Rewrite the previous response from Yoda into plain English while keeping the same meaning."
      },
      {
        title: "Compare philosophies",
        prompt: "Compare Yoda's Jedi philosophy to Stoic philosophy from ancient Greece and explain the similarities and differences."
      }
    ]
  },
  {
    title: "Generate prompts",
    prompt: `Generate 5 creative prompts Text-to-image prompts like: "Cyberpunk cityscape at night, neon lights, flying cars, rain-slicked streets, blade runner aesthetic, highly detailed`,
    followUps: [
      {
        title: "Turn into JSON",
        prompt: `Generate a detailed JSON object for each prompt. Include fields for subjects (list of objects), scene (setting, environment, background details), actions (what's happening), style (artistic style or medium)`
      },
      {
        title: "Sci-fi portraits",
        prompt: "Produce five futuristic character portrait prompts with unique professions and settings."
      },
      {
        title: "Explain image generation",
        prompt: "Explain how text-to-image diffusion models work, covering the denoising process and how text prompts guide generation."
      }
    ]
  },
  {
    title: "Explain LLMs",
    prompt: "Explain how large language models based on transformers work, covering attention, embeddings, and training objectives.",
    followUps: [
      {
        title: "Generate a Quiz",
        prompt: "Craft a 5-question multiple-choice quiz to validate what I learned."
      },
      {
        title: "Compare to RNNs",
        prompt: "Compare transformer-based large language models to recurrent neural networks, focusing on training efficiency and capabilities."
      },
      {
        title: "Student summary",
        prompt: "Summarize the explanation of large language models for a high school student using relatable analogies."
      },
      {
        title: "Write a blog post",
        prompt: "Write a blog post about how transformers revolutionized NLP, targeting software engineers who are new to AI."
      }
    ]
  },
  {
    title: "Translate in Italian",
    prompt: `Translate in Italian: Some are born great, some achieve greatness, and some have greatness thrust upon 'em`,
    followUps: [
      {
        title: "Back to English",
        prompt: "Translate the Italian version back into English while keeping Shakespeare's tone intact."
      },
      {
        title: "Explain choices",
        prompt: "Explain your translation choices for each key phrase from the Italian version."
      },
      {
        title: "Modernize",
        prompt: "Modernize the Italian translation into contemporary informal Italian suitable for social media."
      },
      {
        title: "Teach me Italian",
        prompt: "Help me practice Italian by conversing about this Shakespeare quote, correcting my grammar when needed."
      }
    ]
  },
  {
    title: "Pelican on a bicycle",
    prompt: "Draw an SVG of a pelican riding a bicycle",
    followUps: [
      {
        title: "Add a top hat",
        prompt: "Add a fancy top hat to the pelican and make it look distinguished"
      },
      {
        title: "Make it animated",
        prompt: "Add CSS animations to make the bicycle wheels spin and the pelican's wings flap"
      }
    ]
  }
];
const mcpExamples = [
  {
    title: "Generate an image",
    prompt: "Generate an image of a zebra in front of a volcanic eruption"
  },
  {
    title: "Latest world news",
    prompt: "What is the latest world news?",
    followUps: [
      {
        title: "Tech focus",
        prompt: "What about technology news?"
      },
      {
        title: "San Francisco",
        prompt: "What's happening in San Francisco?"
      },
      {
        title: "vs last week",
        prompt: "How does this compare to last week's news?"
      }
    ]
  },
  {
    title: "Trending models",
    prompt: "What are the top trending models on Hugging Face?",
    followUps: [
      {
        title: "Text generation",
        prompt: "What about text generation models?"
      },
      {
        title: "Image generation",
        prompt: "What about text-to-image models?"
      },
      {
        title: "How to use",
        prompt: "Show me how to use the most popular one"
      }
    ]
  },
  {
    title: "Plan a trip",
    prompt: "Things to do in Tokyo next week",
    followUps: [
      {
        title: "Transport & prices",
        prompt: "How do I get around and how much will it cost?"
      },
      {
        title: "Weather",
        prompt: "What's the weather like in Tokyo next week?"
      },
      {
        title: "Meet people",
        prompt: "Where can I meet new people and make friends?"
      }
    ]
  },
  {
    title: "Compare technologies",
    prompt: "Search the web to compare React, Vue, and Svelte for building web apps in 2025",
    followUps: [
      {
        title: "Performance benchmarks",
        prompt: "Search for recent performance benchmarks comparing these frameworks"
      },
      {
        title: "Job market",
        prompt: "Search for job market trends for each of these frameworks"
      },
      {
        title: "Migration guides",
        prompt: "Search for guides on migrating from React to Svelte"
      }
    ]
  },
  {
    title: "Find a dataset",
    prompt: "Find datasets on Hugging Face for training a sentiment analysis model",
    followUps: [
      {
        title: "Dataset details",
        prompt: "Tell me more about the largest dataset - its size, format, and how to load it"
      },
      {
        title: "Find models",
        prompt: "Find pre-trained models that were trained on this dataset"
      },
      {
        title: "Code snippet",
        prompt: "Show me how to load and preprocess this dataset with the datasets library"
      }
    ]
  },
  {
    title: "Gift ideas",
    prompt: "Search for unique gift ideas for someone who loves cooking",
    followUps: [
      {
        title: "Budget options",
        prompt: "Search for gift ideas under $50"
      },
      {
        title: "Top rated",
        prompt: "Search for the top-rated cooking gadgets of this year"
      },
      {
        title: "DIY gifts",
        prompt: "Search for homemade gift ideas for cooking enthusiasts"
      }
    ]
  },
  {
    title: "Learn something new",
    prompt: "Search for the best resources to learn Rust programming in 2025",
    followUps: [
      {
        title: "Project ideas",
        prompt: "Search for beginner Rust project ideas to practice with"
      },
      {
        title: "Find tools",
        prompt: "Search for the most popular Rust tools and libraries I should know about"
      },
      {
        title: "Community",
        prompt: "Search for Rust communities and forums where I can ask questions"
      }
    ]
  }
];
function ChatWindow($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      messages = [],
      messagesAlternatives = [],
      loading = false,
      pending = false,
      shared = false,
      currentModel,
      models,
      preprompt = void 0,
      files = [],
      draft = "",
      onmessage,
      onstop,
      onretry,
      onshowAlternateMsg
    } = $$props;
    let isReadOnly = derived(() => !models.some((model) => model.id === currentModel.id));
    let shareModalOpen = false;
    let editMsdgId = null;
    let pastedLongContent = false;
    let transcriptionEnabled = derived(() => !!page.data.transcriptionEnabled);
    const handleSubmit = () => {
      if (requireAuthUser() || loading || !draft) return;
      tap();
      onmessage?.(draft);
      draft = "";
    };
    const onPaste = (e) => {
      const textContent = e.clipboardData?.getData("text");
      if (!store_get($$store_subs ??= {}, "$settings", settings).directPaste && textContent && textContent.length >= 3984) {
        e.preventDefault();
        pastedLongContent = true;
        setTimeout(
          () => {
            pastedLongContent = false;
          },
          1e3
        );
        const pastedFile = new File([textContent], "Pasted Content", { type: "application/vnd.chatui.clipboard" });
        files = [...files, pastedFile];
      }
      if (!e.clipboardData) {
        return;
      }
      const pastedFiles = Array.from(e.clipboardData.files);
      if (pastedFiles.length !== 0) {
        e.preventDefault();
        const filteredFiles = pastedFiles.filter((file) => {
          return;
        });
        files = [...files, ...filteredFiles];
      }
    };
    let streamingAssistantMessage = derived(() => (() => {
      for (let i = messages.length - 1; i >= 0; i -= 1) {
        const candidate = messages[i];
        if (candidate.from === "assistant") {
          return candidate;
        }
      }
      return void 0;
    })());
    let lastIsError = derived(() => !loading && (streamingAssistantMessage()?.updates?.findIndex((u) => u.type === "status" && u.status === "error") ?? -1) !== -1);
    const availableTools = derived(() => page.data?.tools ?? []);
    let streamingToolCallName = derived(() => {
      const updates = streamingAssistantMessage()?.updates ?? [];
      if (!updates.length) return null;
      const done = /* @__PURE__ */ new Set();
      for (const u of updates) {
        if (isMessageToolResultUpdate(u) || isMessageToolErrorUpdate(u)) done.add(u.uuid);
      }
      for (let i = updates.length - 1; i >= 0; i -= 1) {
        const u = updates[i];
        if (isMessageToolCallUpdate(u) && !done.has(u.uuid)) {
          return u.call.name;
        }
      }
      return null;
    });
    let sources = derived(() => files?.map((file) => file2base64(file).then((value) => ({ type: "base64", value, mime: file.type, name: file.name }))));
    const unsubscribeShareModal = shareModal.subscribe((value) => {
      shareModalOpen = value;
    });
    onDestroy(() => {
      unsubscribeShareModal();
      shareModal.close();
    });
    messages.at(0)?.id;
    const MIN_SPACER_PX = 208;
    let spacerHeight = MIN_SPACER_PX;
    const settings = useSettingsStore();
    let hideRouterExamples = derived(() => store_get($$store_subs ??= {}, "$settings", settings).hidePromptExamples?.[currentModel.id] ?? false);
    let modelIsMultimodalOverride = derived(() => store_get($$store_subs ??= {}, "$settings", settings).multimodalOverrides?.[currentModel.id]);
    let modelIsMultimodal = derived(() => (modelIsMultimodalOverride() ?? currentModel.multimodal) === true);
    let modelSupportsTools = derived(() => (store_get($$store_subs ??= {}, "$settings", settings).toolsOverrides?.[currentModel.id] ?? currentModel.supportsTools) === true);
    let providerOverride = derived(() => store_get($$store_subs ??= {}, "$settings", settings).providerOverrides?.[currentModel.id]);
    let hasProviderOverride = derived(() => providerOverride() && providerOverride() !== "auto" && !currentModel.isRouter);
    let activeMimeTypes = derived(() => Array.from(/* @__PURE__ */ new Set([
      ...TEXT_MIME_ALLOWLIST,
      ...modelIsMultimodal() ? currentModel.multimodalAcceptedMimetypes ?? [...IMAGE_MIME_ALLOWLIST_DEFAULT] : []
    ])));
    let isFileUploadEnabled = derived(() => activeMimeTypes().length > 0);
    let focused = false;
    let activeRouterExamplePrompt = null;
    let activeExamples = derived(() => store_get($$store_subs ??= {}, "$allBaseServersEnabled", allBaseServersEnabled) ? mcpExamples : routerExamples);
    let routerFollowUps = derived(() => []);
    let shouldShowRouterFollowUps = derived(() => !draft.length && activeRouterExamplePrompt);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="relative z-[-1] min-h-0 min-w-0 svelte-11kuu6h">`);
      if (shareModalOpen) {
        $$renderer3.push("<!--[0-->");
        ShareConversationModal($$renderer3, { open: shareModalOpen, onclose: () => shareModal.close() });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="scrollbar-custom h-full overflow-y-auto svelte-11kuu6h"><div class="mx-auto flex h-full max-w-3xl flex-col gap-6 px-5 pt-6 sm:gap-8 xl:max-w-4xl xl:pt-10 svelte-11kuu6h">`);
      if (preprompt && preprompt != currentModel.preprompt) {
        $$renderer3.push("<!--[0-->");
        SystemPromptModal($$renderer3);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (messages.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex h-max flex-col gap-8 svelte-11kuu6h"><!--[-->`);
        const each_array = ensure_array_like(messages);
        for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
          let message = each_array[idx];
          ChatMessage($$renderer3, {
            loading,
            message,
            alternatives: messagesAlternatives.find((a) => a.includes(message.id)) ?? [],
            isAuthor: !shared,
            readOnly: isReadOnly(),
            isLast: idx === messages.length - 1,
            onretry: (payload) => onretry?.(payload),
            onshowAlternateMsg: (payload) => onshowAlternateMsg?.(payload),
            get editMsdgId() {
              return editMsdgId;
            },
            set editMsdgId($$value) {
              editMsdgId = $$value;
              $$settled = false;
            }
          });
        }
        $$renderer3.push(`<!--]--> `);
        if (isReadOnly()) {
          $$renderer3.push("<!--[0-->");
          ModelSwitch($$renderer3, { models, currentModel });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div> <div class="flex-shrink-0 svelte-11kuu6h"${attr_style(`height: ${stringify(spacerHeight)}px;`)}></div>`);
      } else if (pending) {
        $$renderer3.push("<!--[1-->");
        ChatMessage($$renderer3, {
          loading: true,
          message: {
            id: "0-0-0-0-0",
            content: "",
            from: "assistant",
            children: []
          },
          isAuthor: !shared,
          readOnly: isReadOnly()
        });
      } else {
        $$renderer3.push("<!--[-1-->");
        ChatIntroduction($$renderer3);
      }
      $$renderer3.push(`<!--]--></div> `);
      ScrollToPreviousBtn($$renderer3);
      $$renderer3.push(`<!----> `);
      ScrollToBottomBtn($$renderer3);
      $$renderer3.push(`<!----></div> <div class="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto flex w-full max-w-3xl flex-col items-center justify-center bg-gradient-to-t from-white via-white/100 to-white/0 px-3.5 pt-2 dark:border-gray-800 dark:from-gray-900 dark:via-gray-900/100 dark:to-gray-900/0 max-sm:py-0 sm:px-5 md:pb-4 xl:max-w-4xl [&amp;>*]:pointer-events-auto svelte-11kuu6h">`);
      if (!draft.length && !messages.length && !sources().length && !loading && (currentModel.isRouter || modelSupportsTools() && store_get($$store_subs ??= {}, "$allBaseServersEnabled", allBaseServersEnabled)) && activeExamples().length && !hideRouterExamples() && !lastIsError() && store_get($$store_subs ??= {}, "$mcpServersLoaded", mcpServersLoaded)) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="no-scrollbar mb-3 flex w-full select-none justify-start gap-2 overflow-x-auto whitespace-nowrap text-gray-400 dark:text-gray-500 svelte-11kuu6h"><!--[-->`);
        const each_array_1 = ensure_array_like(activeExamples());
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let ex = each_array_1[$$index_1];
          $$renderer3.push(`<button class="flex items-center rounded-lg bg-gray-100/90 px-2 py-0.5 text-center text-sm backdrop-blur hover:text-gray-500 dark:bg-gray-700/50 dark:hover:text-gray-400 svelte-11kuu6h">${escape_html(ex.title)}</button>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (shouldShowRouterFollowUps() && !lastIsError()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="no-scrollbar mb-3 flex w-full select-none justify-start gap-2 overflow-x-auto whitespace-nowrap text-gray-400 dark:text-gray-500 svelte-11kuu6h"><!--[-->`);
        const each_array_2 = ensure_array_like(routerFollowUps());
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let followUp = each_array_2[$$index_2];
          $$renderer3.push(`<button class="flex items-center gap-1 rounded-lg bg-gray-100/90 px-2 py-0.5 text-center text-sm backdrop-blur hover:text-gray-500 dark:bg-gray-700/50 dark:hover:text-gray-400 svelte-11kuu6h">`);
          Direction_right_01($$renderer3, { class: "scale-y-[-1] text-xs" });
          $$renderer3.push(`<!----> ${escape_html(followUp.title)}</button>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (sources()?.length && !loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex flex-row flex-wrap justify-center gap-2.5 rounded-xl pb-3 svelte-11kuu6h"><!--[-->`);
        const each_array_3 = ensure_array_like(sources());
        for (let index = 0, $$length = each_array_3.length; index < $$length; index++) {
          let source = each_array_3[index];
          await_block($$renderer3, source, () => {
          }, (src) => {
            UploadedFile($$renderer3, {
              file: src,
              onclose: () => {
                files = files.filter((_, i) => i !== index);
              }
            });
          });
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="w-full svelte-11kuu6h"><div class="flex w-full *:mb-3 svelte-11kuu6h">`);
      if (!loading && lastIsError()) {
        $$renderer3.push("<!--[0-->");
        RetryBtn($$renderer3, {
          classNames: "ml-auto"
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <form tabindex="-1"${attr("aria-label", isFileUploadEnabled() ? "file dropzone" : void 0)}${attr_class(
        clsx({
          "relative flex w-full max-w-4xl flex-1 items-center rounded-xl border bg-gray-100 dark:border-gray-700 dark:bg-gray-800": true,
          "opacity-30": isReadOnly(),
          "max-sm:mb-4": focused && isVirtualKeyboard()
        }),
        "svelte-11kuu6h"
      )}>`);
      {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div${attr_class("flex w-full flex-1 rounded-xl border-none bg-transparent svelte-11kuu6h", void 0, { "paste-glow": pastedLongContent })}>`);
        if (lastIsError()) {
          $$renderer3.push("<!--[0-->");
          ChatInput($$renderer3, {
            value: "Sorry, something went wrong. Please try again.",
            disabled: true
          });
        } else {
          $$renderer3.push("<!--[-1-->");
          ChatInput($$renderer3, {
            placeholder: isReadOnly() ? "This conversation is read-only." : "Ask anything",
            loading,
            mimeTypes: activeMimeTypes(),
            onsubmit: handleSubmit,
            onPaste,
            disabled: isReadOnly() || lastIsError(),
            modelIsMultimodal: modelIsMultimodal(),
            modelSupportsTools: modelSupportsTools(),
            get value() {
              return draft;
            },
            set value($$value) {
              draft = $$value;
              $$settled = false;
            },
            get files() {
              return files;
            },
            set files($$value) {
              files = $$value;
              $$settled = false;
            },
            get focused() {
              return focused;
            },
            set focused($$value) {
              focused = $$value;
              $$settled = false;
            }
          });
        }
        $$renderer3.push(`<!--]--> `);
        if (loading) {
          $$renderer3.push("<!--[0-->");
          StopGeneratingBtn($$renderer3, {
            showBorder: true,
            classNames: "absolute bottom-2 right-2 size-8 sm:size-7 self-end rounded-full border bg-white text-black shadow transition-none dark:border-transparent dark:bg-gray-600 dark:text-white"
          });
        } else {
          $$renderer3.push("<!--[-1-->");
          if (transcriptionEnabled()) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<button type="button" class="btn absolute bottom-2 right-10 mr-1.5 size-8 self-end rounded-full border bg-white/50 text-gray-500 transition-none hover:bg-gray-50 hover:text-gray-700 dark:border-transparent dark:bg-gray-600/50 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-white sm:right-9 sm:size-7 svelte-11kuu6h"${attr("disabled", isReadOnly(), true)} aria-label="Start voice recording">`);
            Mic($$renderer3, { class: "size-4" });
            $$renderer3.push(`<!----></button>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <button${attr_class(
            `btn absolute bottom-2 right-2 size-8 self-end rounded-full border bg-white text-black shadow transition-none enabled:hover:bg-white enabled:hover:shadow-inner dark:border-transparent dark:bg-gray-600 dark:text-white dark:hover:enabled:bg-black sm:size-7 ${stringify(!draft || isReadOnly() ? "" : "!bg-black !text-white dark:!bg-white dark:!text-black")}`,
            "svelte-11kuu6h"
          )}${attr("disabled", !draft || isReadOnly(), true)} type="submit" aria-label="Send message" name="submit">`);
          Arrow_up($$renderer3, {});
          $$renderer3.push(`<!----></button>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--></form> <div${attr_class(
        clsx({
          "mt-1.5 flex h-5 items-center self-stretch whitespace-nowrap px-0.5 text-xs text-gray-400/90 max-md:mb-2 max-sm:gap-2": true,
          "max-sm:hidden": focused && isVirtualKeyboard()
        }),
        "svelte-11kuu6h"
      )}>`);
      if (models.find((m) => m.id === currentModel.id)) {
        $$renderer3.push("<!--[0-->");
        if (loading && streamingToolCallName()) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<span class="inline-flex items-center gap-1 whitespace-nowrap text-xs svelte-11kuu6h">`);
          Hammer($$renderer3, { class: "size-3" });
          $$renderer3.push(`<!----> Calling tool <span class="loading-dots font-medium svelte-11kuu6h">${escape_html(availableTools().find((t) => t.name === streamingToolCallName())?.displayName ?? streamingToolCallName())}</span></span>`);
        } else if (!currentModel.isRouter || !loading) {
          $$renderer3.push("<!--[1-->");
          $$renderer3.push(`<a${attr("href", `${stringify(base)}/settings/${stringify(currentModel.id)}`)} class="inline-flex items-center gap-1 hover:underline svelte-11kuu6h">`);
          if (currentModel.isRouter) {
            $$renderer3.push("<!--[0-->");
            IconOmni($$renderer3, {});
            $$renderer3.push(`<!----> ${escape_html(currentModel.displayName)}`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`Model: ${escape_html(currentModel.displayName)} `);
            if (hasProviderOverride()) {
              $$renderer3.push("<!--[0-->");
              const hubOrg = PROVIDERS_HUB_ORGS[providerOverride()];
              $$renderer3.push(`<span${attr_class(
                `inline-flex shrink-0 items-center rounded p-0.5 ${stringify(providerOverride() === "fastest" ? "bg-green-100 text-green-600 dark:bg-green-800/20 dark:text-green-500" : providerOverride() === "cheapest" ? "bg-blue-100 text-blue-600 dark:bg-blue-800/20 dark:text-blue-500" : "")}`,
                "svelte-11kuu6h"
              )}${attr("title", `Provider: ${stringify(providerOverride())}`)}>`);
              if (providerOverride() === "fastest") {
                $$renderer3.push("<!--[0-->");
                IconFast($$renderer3, { classNames: "text-sm" });
              } else if (providerOverride() === "cheapest") {
                $$renderer3.push("<!--[1-->");
                IconCheap($$renderer3, { classNames: "text-sm" });
              } else if (hubOrg) {
                $$renderer3.push("<!--[2-->");
                $$renderer3.push(`<img${attr("src", `https://huggingface.co/api/avatars/${stringify(hubOrg)}`)}${attr("alt", providerOverride())} class="size-3 flex-none rounded-sm svelte-11kuu6h"/>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></span>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]--> `);
          Caret_down($$renderer3, { class: "-ml-0.5 text-xxs" });
          $$renderer3.push(`<!----></a>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="loading-dots relative inline-flex items-center text-gray-400 dark:text-gray-400 svelte-11kuu6h" aria-label="Routing…">`);
          IconOmni($$renderer3, { classNames: "text-xs animate-pulse mr-1" });
          $$renderer3.push(`<!----> Routing</div>`);
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<span class="inline-flex items-center line-through dark:border-gray-700 svelte-11kuu6h">${escape_html(currentModel.id)}</span>`);
      }
      $$renderer3.push(`<!--]--> `);
      if (!messages.length && !loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<span class="max-sm:hidden svelte-11kuu6h">Generated content may be inaccurate or false.</span>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { files, draft });
  });
}
const findCurrentModel = (models, _oldModels = [], id) => {
  if (id) {
    const direct = models.find((m) => m.id === id);
    if (direct) return direct;
  }
  return models[0];
};
export {
  ChatWindow as C,
  file2base64 as a,
  findCurrentModel as f,
  requireAuthUser as r,
  streamStart as s
};
