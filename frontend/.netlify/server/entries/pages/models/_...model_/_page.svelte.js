import { z as head, e as escape_html, g as attr, h as stringify, m as derived, k as store_get, u as unsubscribe_stores } from "../../../../chunks/root.js";
import { p as page } from "../../../../chunks/index2.js";
import { b as base } from "../../../../chunks/server.js";
import "../../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import { g as goto } from "../../../../chunks/client.js";
import { u as usePublicConfig } from "../../../../chunks/PublicConfig.svelte.js";
import { C as ChatWindow, f as findCurrentModel } from "../../../../chunks/models2.js";
import { u as useSettingsStore } from "../../../../chunks/settings2.js";
import { e as error, E as ERROR_MESSAGES } from "../../../../chunks/errors.js";
import { p as pendingMessage } from "../../../../chunks/pendingMessage.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let loading = false;
    let files = [];
    let draft = "";
    const settings = useSettingsStore();
    let modelId = derived(() => page.params.model ?? "");
    const publicConfig = usePublicConfig();
    let modelPath = derived(() => modelId().split("/").map((segment) => encodeURIComponent(segment)).join("/"));
    async function createConversation(message) {
      try {
        loading = true;
        const res = await fetch(`${base}/conversation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: modelId(),
            preprompt: store_get($$store_subs ??= {}, "$settings", settings).customPromptsEnabled?.[modelId()] ?? true ? store_get($$store_subs ??= {}, "$settings", settings).customPrompts[modelId()] : ""
          })
        });
        if (!res.ok) {
          error.set("Error while creating conversation, try again.");
          console.error("Error while creating conversation: " + await res.text());
          return;
        }
        const { conversationId } = await res.json();
        pendingMessage.set({ content: message, files });
        await goto(`${base}/conversation/${conversationId}`, { invalidateAll: true });
      } catch (err) {
        error.set(ERROR_MESSAGES.default);
        console.error(err);
      } finally {
        loading = false;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1d34z81", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>${escape_html(modelId())} - ${escape_html(publicConfig.PUBLIC_APP_NAME)}</title>`);
        });
        $$renderer4.push(`<meta property="og:title"${attr("content", `${stringify(modelId())} - ${stringify(publicConfig.PUBLIC_APP_NAME)}`)}/> <meta property="og:type" content="website"/> <meta property="og:description"${attr("content", `Use ${stringify(modelId())} with ${stringify(publicConfig.PUBLIC_APP_NAME)}`)}/> <meta property="og:image"${attr("content", `${stringify(publicConfig.PUBLIC_ORIGIN || page.url.origin)}${stringify(base)}/models/${stringify(modelPath())}/thumbnail.png`)}/> <meta property="og:image:alt"${attr("content", `${stringify(modelId())} - ${stringify(publicConfig.PUBLIC_APP_NAME)}`)}/> <meta property="og:image:width" content="1200"/> <meta property="og:image:height" content="648"/> <meta property="og:url"${attr("content", page.url.href)}/> <meta property="og:site_name"${attr("content", publicConfig.PUBLIC_APP_NAME)}/> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:title"${attr("content", `${stringify(modelId())} - ${stringify(publicConfig.PUBLIC_APP_NAME)}`)}/> <meta name="twitter:description"${attr("content", `Use ${stringify(modelId())} with ${stringify(publicConfig.PUBLIC_APP_NAME)}`)}/> <meta name="twitter:image"${attr("content", `${stringify(publicConfig.PUBLIC_ORIGIN || page.url.origin)}${stringify(base)}/models/${stringify(modelPath())}/thumbnail.png`)}/> <meta name="twitter:image:alt"${attr("content", `${stringify(modelId())} - ${stringify(publicConfig.PUBLIC_APP_NAME)}`)}/>`);
      });
      ChatWindow($$renderer3, {
        onmessage: (message) => createConversation(message),
        loading,
        currentModel: findCurrentModel(data.models, data.oldModels, modelId()),
        models: data.models,
        get files() {
          return files;
        },
        set files($$value) {
          files = $$value;
          $$settled = false;
        },
        get draft() {
          return draft;
        },
        set draft($$value) {
          draft = $$value;
          $$settled = false;
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
