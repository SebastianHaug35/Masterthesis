import { z as head, e as escape_html, k as store_get, u as unsubscribe_stores, m as derived, A as store_set } from "../../chunks/root.js";
import { g as goto } from "../../chunks/client.js";
import { b as base } from "../../chunks/server.js";
import "../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/index2.js";
import { u as usePublicConfig } from "../../chunks/PublicConfig.svelte.js";
import { C as ChatWindow, f as findCurrentModel } from "../../chunks/models2.js";
import { E as ERROR_MESSAGES, e as error } from "../../chunks/errors.js";
import { p as pendingMessage } from "../../chunks/pendingMessage.js";
import { u as useSettingsStore } from "../../chunks/settings2.js";
import { l as loading } from "../../chunks/loading.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const publicConfig = usePublicConfig();
    let { data } = $$props;
    let hasModels = derived(() => Boolean(data.models?.length));
    let files = [];
    let draft = "";
    const settings = useSettingsStore();
    async function createConversation(message) {
      try {
        store_set(loading, true);
        const validModels = data.models.map((model2) => model2.id);
        let model;
        if (validModels.includes(store_get($$store_subs ??= {}, "$settings", settings).activeModel)) {
          model = store_get($$store_subs ??= {}, "$settings", settings).activeModel;
        } else {
          model = data.models[0].id;
        }
        const res = await fetch(`${base}/conversation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            preprompt: store_get($$store_subs ??= {}, "$settings", settings).customPromptsEnabled?.[store_get($$store_subs ??= {}, "$settings", settings).activeModel] ?? true ? store_get($$store_subs ??= {}, "$settings", settings).customPrompts[store_get($$store_subs ??= {}, "$settings", settings).activeModel] : ""
          })
        });
        if (!res.ok) {
          let errorMessage = ERROR_MESSAGES.default;
          try {
            const json = await res.json();
            errorMessage = json.message || errorMessage;
          } catch {
            if (res.status === 401) {
              errorMessage = "Authentication required";
            }
          }
          error.set(errorMessage);
          console.error("Error while creating conversation: ", errorMessage);
          return;
        }
        const { conversationId } = await res.json();
        pendingMessage.set({ content: message, files });
        await goto(`${base}/conversation/${conversationId}`, { invalidateAll: true });
      } catch (err) {
        error.set(err.message || ERROR_MESSAGES.default);
        console.error(err);
      } finally {
        store_set(loading, false);
      }
    }
    let currentModel = derived(() => findCurrentModel(data.models, data.oldModels, store_get($$store_subs ??= {}, "$settings", settings).activeModel));
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1uha8ag", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>${escape_html(publicConfig.PUBLIC_APP_NAME)}</title>`);
        });
      });
      if (hasModels()) {
        $$renderer3.push("<!--[0-->");
        ChatWindow($$renderer3, {
          onmessage: (message) => createConversation(message),
          loading: store_get($$store_subs ??= {}, "$loading", loading),
          currentModel: currentModel(),
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
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="mx-auto my-20 max-w-xl rounded-xl border p-6 text-center dark:border-gray-700"><h2 class="mb-2 text-xl font-semibold">No models available</h2> <p class="text-gray-600 dark:text-gray-300">No chat models are configured. Set \`OPENAI_BASE_URL\` and ensure the server can reach the
			endpoint, then reload. If unset, the app defaults to the Hugging Face router.</p></div>`);
      }
      $$renderer3.push(`<!--]-->`);
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
