import { d as sanitize_props, f as attributes, z as head, g as attr, j as ensure_array_like, k as store_get, h as stringify, i as attr_class, e as escape_html, u as unsubscribe_stores, m as derived } from "../../../chunks/root.js";
import { u as usePublicConfig } from "../../../chunks/PublicConfig.svelte.js";
import { b as base } from "../../../chunks/server.js";
import "../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import { p as page } from "../../../chunks/index2.js";
import { h as html } from "../../../chunks/html.js";
import { H as Hammer } from "../../../chunks/hammer.js";
import { I as Image } from "../../../chunks/image.js";
import { I as IconFast, a as IconCheap } from "../../../chunks/IconCheap.js";
import { PROVIDERS_HUB_ORGS } from "@huggingface/inference";
import { u as useSettingsStore } from "../../../chunks/settings2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/utils.js";
import "../../../chunks/exports.js";
import "../../../chunks/client.js";
function Help_filled($$renderer, $$props) {
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
  )}>${html(`<path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 23a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 25m1.142-7.754v2.501h-2.25V15h2.125a2.376 2.376 0 0 0 0-4.753h-1.5a2.38 2.38 0 0 0-2.375 2.375v.638h-2.25v-.638A4.63 4.63 0 0 1 15.517 8h1.5a4.624 4.624 0 0 1 .125 9.246"/><path fill="none" d="M16 25a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 25m1.142-7.754v2.501h-2.25V15h2.125a2.376 2.376 0 0 0 0-4.753h-1.5a2.38 2.38 0 0 0-2.375 2.375v.638h-2.25v-.638A4.63 4.63 0 0 1 15.517 8h1.5a4.624 4.624 0 0 1 .125 9.246"/>`)}</svg>`);
}
function Settings($$renderer, $$props) {
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
  )}>${html(`<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></g>`)}</svg>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const settings = useSettingsStore();
    const publicConfig = usePublicConfig();
    let modelFilter = "";
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ");
    let queryTokens = derived(() => normalize(modelFilter).trim().split(/\s+/).filter(Boolean));
    let filteredModels = derived(() => data.models.filter((el) => !el.unlisted).filter((el) => {
      const haystack = normalize(`${el.id} ${el.name ?? ""} ${el.displayName ?? ""}`);
      return queryTokens().every((q) => haystack.includes(q));
    }));
    head("18pldtr", $$renderer2, ($$renderer3) => {
      if (publicConfig.isHuggingChat) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>${escape_html(publicConfig.PUBLIC_APP_NAME)} - Models</title>`);
        });
        $$renderer3.push(`<meta property="og:title"${attr("content", `${stringify(publicConfig.PUBLIC_APP_NAME)} - Models`)}/> <meta property="og:type" content="website"/> <meta property="og:description"${attr("content", `Browse ${stringify(publicConfig.PUBLIC_APP_NAME)} available models`)}/> <meta property="og:url"${attr("content", page.url.href)}/> <meta property="og:image"${attr("content", `${stringify(publicConfig.assetPath)}/thumbnail.png`)}/> <meta property="og:image:alt"${attr("content", `${stringify(publicConfig.PUBLIC_APP_NAME)} preview`)}/> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:title"${attr("content", `${stringify(publicConfig.PUBLIC_APP_NAME)} - Models`)}/> <meta name="twitter:description"${attr("content", `Browse ${stringify(publicConfig.PUBLIC_APP_NAME)} available models`)}/> <meta name="twitter:image"${attr("content", `${stringify(publicConfig.assetPath)}/thumbnail.png`)}/> <meta name="twitter:image:alt"${attr("content", `${stringify(publicConfig.PUBLIC_APP_NAME)} preview`)}/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`<div class="scrollbar-custom h-full overflow-y-auto py-12 max-sm:pt-8 md:py-24"><div class="pt-42 mx-auto flex flex-col px-5 xl:w-[60rem] 2xl:w-[64rem]"><div class="flex items-center"><h1 class="text-xl font-bold sm:text-2xl">Models</h1> `);
    if (publicConfig.isHuggingChat) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a href="https://huggingface.co/docs/inference-providers" class="ml-auto text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300" target="_blank" aria-label="Hub discussion about models">`);
      Help_filled($$renderer2, {});
      $$renderer2.push(`<!----></a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <h2 class="text-gray-500">All models available`);
    if (publicConfig.isHuggingChat) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(` via <a target="_blank" href="https://huggingface.co/inference/models" class="underline decoration-gray-300 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-500">Inference Providers</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></h2> <input type="search"${attr("value", modelFilter)} placeholder="Search by name" aria-label="Search models by name or id" class="mt-4 w-full rounded-3xl border border-gray-300 bg-white px-5 py-2 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-gray-700"/> <div class="mt-6 min-h-[50vh]"><div class="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"><!--[-->`);
    const each_array = ensure_array_like(filteredModels());
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let model = each_array[index];
      const isActive = model.id === store_get($$store_subs ??= {}, "$settings", settings).activeModel;
      const isLast = index === filteredModels().length - 1;
      $$renderer2.push(`<a${attr("href", `${stringify(base)}/models/${stringify(model.id)}`)}${attr("aria-label", `Model card for ${stringify(model.displayName)}`)}${attr_class(`group flex cursor-pointer items-center gap-2 p-3 sm:gap-4 sm:p-4 ${stringify(isActive ? "bg-gray-50 dark:bg-gray-800" : "bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800")} ${stringify(isLast ? "" : "border-b border-gray-100 dark:border-gray-800")}`)}><div class="flex-shrink-0">`);
      if (model.logoUrl) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<img${attr("alt", model.displayName)} class="size-8 rounded-lg border border-gray-100 bg-gray-50 object-cover dark:border-gray-700 dark:bg-gray-100 sm:size-10"${attr("src", model.logoUrl)}/>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="h-10 w-10 rounded-lg border border-gray-100 bg-gray-200 dark:border-gray-700 dark:bg-gray-700" aria-hidden="true"></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="min-w-0 flex-1"><div class="flex items-center gap-2"><h3${attr_class("truncate font-medium text-gray-900 dark:text-gray-200 max-sm:text-xs", void 0, { "font-bold": isActive, "dark:text-white": isActive })}>${escape_html(model.displayName)}</h3> `);
      if (index === 0 && model.isRouter && !isActive) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-500 dark:border-gray-700 dark:text-gray-400">Default</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <p class="truncate pr-4 text-xs text-gray-500 dark:text-gray-400 sm:text-[13px]">${escape_html(model.isRouter ? "Routes your messages to the best model for your request." : model.description || "-")}</p></div> <div class="flex flex-shrink-0 items-center gap-1.5">`);
      if (publicConfig.isHuggingChat && !model.isRouter && store_get($$store_subs ??= {}, "$settings", settings).providerOverrides?.[model.id] && store_get($$store_subs ??= {}, "$settings", settings).providerOverrides[model.id] !== "auto") {
        $$renderer2.push("<!--[0-->");
        const providerOverride = store_get($$store_subs ??= {}, "$settings", settings).providerOverrides[model.id];
        const hubOrg = PROVIDERS_HUB_ORGS[providerOverride];
        if (providerOverride === "fastest") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div title="Provider: Fastest" class="rounded-md bg-green-50 p-1.5 text-green-600 dark:bg-green-900/20 dark:text-green-400">`);
          IconFast($$renderer2, { classNames: "size-3 sm:size-3.5" });
          $$renderer2.push(`<!----></div>`);
        } else if (providerOverride === "cheapest") {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<div title="Provider: Cheapest" class="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">`);
          IconCheap($$renderer2, { classNames: "size-3 sm:size-3.5" });
          $$renderer2.push(`<!----></div>`);
        } else if (hubOrg) {
          $$renderer2.push("<!--[2-->");
          $$renderer2.push(`<div${attr("title", `Provider: ${stringify(providerOverride)}`)} class="flex size-[26px] items-center justify-center rounded-md bg-gray-100 p-1 dark:bg-gray-800 sm:size-[30px]"><img${attr("src", `https://huggingface.co/api/avatars/${stringify(hubOrg)}`)}${attr("alt", providerOverride)} class="size-full rounded"/></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (store_get($$store_subs ??= {}, "$settings", settings).toolsOverrides?.[model.id] ?? model.supportsTools) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div title="This model supports tool calling (functions)." class="rounded-md bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">`);
        Hammer($$renderer2, { class: "size-3 sm:size-3.5" });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (store_get($$store_subs ??= {}, "$settings", settings).multimodalOverrides?.[model.id] ?? model.multimodal) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div title="This model is multimodal and supports image inputs natively." class="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">`);
        Image($$renderer2, { class: "size-3 sm:size-3.5" });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button type="button" title="Model settings"${attr("aria-label", `Model settings for ${stringify(model.displayName)}`)} class="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">`);
      Settings($$renderer2, { class: "size-3 sm:size-3.5" });
      $$renderer2.push(`<!----></button> `);
      if (isActive) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="rounded-full bg-black px-2.5 py-1 text-xs font-bold text-white shadow-md dark:bg-white dark:text-black">Active</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></a>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
