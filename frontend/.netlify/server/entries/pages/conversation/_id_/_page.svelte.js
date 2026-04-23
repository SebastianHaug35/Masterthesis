import { i as attr_class, o as clsx, h as stringify, k as store_get, e as escape_html, u as unsubscribe_stores, l as bind_props, z as head, m as derived, A as store_set } from "../../../../chunks/root.js";
import { C as ChatWindow, f as findCurrentModel, r as requireAuthUser, a as file2base64, s as streamStart } from "../../../../chunks/models2.js";
import { w as writable } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/index2.js";
import { i as invalidateAll } from "../../../../chunks/client.js";
import { b as base } from "../../../../chunks/server.js";
import "../../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import { e as error, E as ERROR_MESSAGES } from "../../../../chunks/errors.js";
import { M as MessageUpdateType, c as MessageUpdateStatus } from "../../../../chunks/MessageUpdate.js";
import { a as addSibling, b as addChildren } from "../../../../chunks/addSibling.js";
import { r as resolveStreamingMode, f as fetchMessageUpdates } from "../../../../chunks/messageUpdates.js";
import { u as useSettingsStore } from "../../../../chunks/settings2.js";
import { d as enabledServers } from "../../../../chunks/shareModal.js";
import { M as Modal } from "../../../../chunks/Modal.js";
import { i as isPro, I as IconPro } from "../../../../chunks/IconPro.js";
import { l as loading } from "../../../../chunks/loading.js";
function IconDazzled($$renderer, $$props) {
  let { classNames = "" } = $$props;
  $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"${attr_class(clsx(classNames))} fill="none" viewBox="0 0 26 23"><path fill="url(#gr)" d="M.93 10.65A10.17 10.17 0 0 1 11.11.48h4.67a9.45 9.45 0 0 1 0 18.89H4.53L1.62 22.2a.38.38 0 0 1-.69-.28V10.65Z"></path><path fill="#000" fill-rule="evenodd" d="M11.52 7.4a1.86 1.86 0 1 1-3.72 0 1.86 1.86 0 0 1 3.72 0Zm7.57 0a1.86 1.86 0 1 1-3.73 0 1.86 1.86 0 0 1 3.73 0ZM8.9 12.9a.55.55 0 0 0-.11.35.76.76 0 0 1-1.51 0c0-.95.67-1.94 1.76-1.94 1.09 0 1.76 1 1.76 1.94H9.3a.55.55 0 0 0-.12-.35c-.06-.07-.1-.08-.13-.08s-.08 0-.14.08Zm4.04 0a.55.55 0 0 0-.12.35h-1.51c0-.95.68-1.94 1.76-1.94 1.1 0 1.77 1 1.77 1.94h-1.51a.55.55 0 0 0-.12-.35c-.06-.07-.11-.08-.14-.08-.02 0-.07 0-.13.08Zm-1.89.79c-.02 0-.07-.01-.13-.08a.55.55 0 0 1-.12-.36h-1.5c0 .95.67 1.95 1.75 1.95 1.1 0 1.77-1 1.77-1.95h-1.51c0 .16-.06.28-.12.36-.06.07-.11.08-.14.08Zm4.04 0c-.03 0-.08-.01-.14-.08a.55.55 0 0 1-.12-.36h-1.5c0 .95.67 1.95 1.76 1.95 1.08 0 1.76-1 1.76-1.95h-1.51c0 .16-.06.28-.12.36-.06.07-.11.08-.13.08Zm1.76-.44c0-.16.05-.28.12-.35.06-.07.1-.08.13-.08s.08 0 .14.08c.06.07.11.2.11.35a.76.76 0 0 0 1.51 0c0-.95-.67-1.94-1.76-1.94-1.09 0-1.76 1-1.76 1.94h1.5Z" clip-rule="evenodd"></path><defs><radialGradient id="gr" cx="0" cy="0" r="1" gradientTransform="matrix(0 31.37 -34.85 0 13.08 -9.02)" gradientUnits="userSpaceOnUse"><stop stop-color="#FFD21E"></stop><stop offset="1" stop-color="red"></stop></radialGradient></defs></svg>`);
}
const isAborted = writable(false);
const titleUpdate = writable(null);
class UpdateDebouncer {
  constructor() {
    this.renderStartedAt = null;
    this.lastRenderTimes = [];
  }
  get maxUpdateTime() {
    if (this.lastRenderTimes.length === 0) {
      return 50;
    }
    const averageTime = this.lastRenderTimes.reduce((acc, time) => acc + time, 0) / this.lastRenderTimes.length;
    return Math.min(averageTime * 3, 500);
  }
  startRender() {
    this.renderStartedAt = /* @__PURE__ */ new Date();
  }
  endRender() {
    if (!this.renderStartedAt) {
      return;
    }
    const timeSinceRenderStarted = (/* @__PURE__ */ new Date()).getTime() - this.renderStartedAt.getTime();
    this.lastRenderTimes.push(timeSinceRenderStarted);
    if (this.lastRenderTimes.length > 10) {
      this.lastRenderTimes.shift();
    }
    this.renderStartedAt = null;
  }
}
const updateDebouncer = new UpdateDebouncer();
function SubscribeModal($$renderer, $$props) {
  var $$store_subs;
  let { close } = $$props;
  Modal($$renderer, {
    closeOnBackdrop: false,
    onclose: close,
    width: "!max-w-[420px] !m-4",
    children: ($$renderer2) => {
      $$renderer2.push(`<div class="flex w-full flex-col gap-8 bg-white bg-gradient-to-b to-transparent px-6 pb-7 dark:bg-black dark:from-white/10 dark:to-white/5"><div class="-mx-6 grid h-48 select-none place-items-center bg-gradient-to-t from-black/5 dark:from-white/10"><div class="flex flex-col items-center justify-center gap-2.5 px-8 text-center"><div${attr_class(`flex size-14 items-center justify-center rounded-full text-3xl ${stringify(store_get($$store_subs ??= {}, "$isPro", isPro) ? "bg-gradient-to-br from-yellow-500/15 via-orange-500/15 to-red-500/15" : "bg-gradient-to-br from-pink-500/15 from-15% via-green-500/15 to-yellow-500/15")}`)}>`);
      if (store_get($$store_subs ??= {}, "$isPro", isPro)) {
        $$renderer2.push("<!--[0-->");
        IconDazzled($$renderer2, {});
      } else {
        $$renderer2.push("<!--[-1-->");
        IconPro($$renderer2, { classNames: "!mr-0" });
      }
      $$renderer2.push(`<!--]--></div> <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">${escape_html(store_get($$store_subs ??= {}, "$isPro", isPro) ? "Out of Credits" : "Upgrade Required")}</h2></div></div> <div class="text-gray-700 dark:text-gray-200">`);
      if (store_get($$store_subs ??= {}, "$isPro", isPro)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="text-[15px] leading-relaxed">You've used all your available credits. Purchase additional credits to continue using
					HuggingChat.</p> <p class="mt-3 text-[15px] italic leading-relaxed opacity-75">Your credits can be used in other HF services and external apps via Inference Providers.</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<p class="text-[15px] leading-relaxed">You've reached your message limit. Upgrade to Hugging Face PRO to continue using
					HuggingChat.</p> <p class="mt-3 text-[15px] italic leading-relaxed opacity-75">It's also possible to use your PRO credits in your favorite AI tools.</p>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="flex flex-col gap-2.5">`);
      if (store_get($$store_subs ??= {}, "$isPro", isPro)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="https://huggingface.co/settings/billing?add-credits=true" target="_blank" rel="noopener noreferrer" class="w-full rounded-xl bg-black px-5 py-2.5 text-center text-base font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">Purchase Credits</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<a href="https://huggingface.co/subscribe/pro?from=HuggingChat" target="_blank" rel="noopener noreferrer" class="w-full rounded-xl bg-black px-5 py-2.5 text-center text-base font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">Upgrade to Pro</a>`);
      }
      $$renderer2.push(`<!--]--> <button class="w-full rounded-xl bg-gray-200 px-5 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-300/80 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10">Maybe later</button></div></div>`);
    }
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data = void 0 } = $$props;
    let convId = derived(() => page.params.id ?? "");
    let pending = false;
    let initialRun = true;
    let showSubscribeModal = false;
    let stopRequested = false;
    let stopRequestPromise;
    let messageUpdatesAbortController = new AbortController();
    let files = [];
    let conversations = data.conversations;
    function createMessagesPath(messages2, msgId) {
      if (initialRun) {
        if (!msgId && page.url.searchParams.get("leafId")) {
          msgId = page.url.searchParams.get("leafId");
          page.url.searchParams.delete("leafId");
        }
        initialRun = false;
      }
      const msg = messages2.find((msg2) => msg2.id === msgId) ?? messages2.at(-1);
      if (!msg) return [];
      const { ancestors } = msg;
      const path = [];
      if (ancestors?.length) {
        for (const ancestorId of ancestors) {
          const ancestor = messages2.find((msg2) => msg2.id === ancestorId);
          if (ancestor) {
            path.push(ancestor);
          }
        }
      }
      path.push(msg);
      let childrenIds = msg.children;
      while (childrenIds?.length) {
        let lastChildId = childrenIds.at(-1);
        const lastChild = messages2.find((msg2) => msg2.id === lastChildId);
        if (lastChild) {
          path.push(lastChild);
        }
        childrenIds = lastChild?.children;
      }
      return path;
    }
    function createMessagesAlternatives(messages2) {
      const alternatives = [];
      for (const message of messages2) {
        if (message.children?.length) {
          alternatives.push(message.children);
        }
      }
      return alternatives;
    }
    async function writeMessage({
      prompt,
      messageId = (
        // used for building the prompt, subtree of the conversation that goes from the latest message to the root
        // two cases, if we're retrying a user message with a newPrompt set,
        // it means we're editing a user message
        // if we're retrying on an assistant message, newPrompt cannot be set
        // it means we're retrying the last assistant message for a new answer
        // add a sibling to this message from the user, with the alternative prompt
        // add a children to that sibling, where we can write to
        // we're retrying an assistant message, to generate a new answer
        // just add a sibling to the assistant answer where we can write to
        // just a normal linear conversation, so we add the user message
        // and the blank assistant message back to back
        // Initialize lastUpdateTime outside the loop to persist between updates
        // Remove null characters added due to remote keylogging prevention
        // See server code for more details
        // Create fresh objects/arrays so the UI reacts to merged tokens
        // If we receive a non-stream update (e.g. tool/status/final answer),
        // flush any buffered stream tokens so the UI doesn't appear to cut
        // mid-sentence while tools are running or the final answer arrives.
        // Coalesce UI updates to animation frames for smooth mode.
        // Mirror server-side merge behavior so the UI reflects the
        // final text once tools complete, while preserving any
        // pre‑tool streamed content when appropriate.
        // Preserve streamed content on abort. If we never streamed, fall back to finalText.
        // A. Already streamed the same final text; keep as-is.
        // B. Final text already includes streamed prefix; use it verbatim.
        // C. Merge with a paragraph break for readability.
        // No tools: final answer replaces streamed content so
        // the provider's final text is authoritative.
        // Check if this is a 402 payment required error
        // Update router metadata immediately when received
        // Wait for the stop request to complete before refreshing data,
        // so the server has persisted interrupted:true to the database.
        // Mark the last assistant message as interrupted locally so
        // isConversationGenerationActive() immediately returns false,
        // removing the background poller and preventing $loading re-enable.
        // Store the promise so writeMessage's finally block can await it
        // before calling invalidateAll() — ensures the server has persisted
        // interrupted:true before we fetch fresh data.
        // Stop generation on ESC key when loading
        // create a linear list of `messagesPath` from `messages` that is a tree of threaded messages
        messagesPath().at(-1)?.id ?? void 0
      ),
      isRetry = false
    }) {
      try {
        stopRequested = false;
        store_set(isAborted, false);
        store_set(loading, true);
        pending = true;
        const base64Files = await Promise.all((files ?? []).map((file) => file2base64(file).then((value) => ({ type: "base64", value, mime: file.type, name: file.name }))));
        let messageToWriteToId = void 0;
        if (isRetry && messageId) {
          const messageToRetry = messages.find((message) => message.id === messageId);
          if (!messageToRetry) {
            store_set(error, "Message not found");
          }
          if (messageToRetry?.from === "user" && prompt) {
            const newUserMessageId = addSibling({ messages, rootMessageId: data.rootMessageId }, { from: "user", content: prompt, files: messageToRetry.files }, messageId);
            messageToWriteToId = addChildren({ messages, rootMessageId: data.rootMessageId }, { from: "assistant", content: "" }, newUserMessageId);
          } else if (messageToRetry?.from === "assistant") {
            messageToWriteToId = addSibling({ messages, rootMessageId: data.rootMessageId }, { from: "assistant", content: "" }, messageId);
          }
        } else {
          const newUserMessageId = addChildren({ messages, rootMessageId: data.rootMessageId }, { from: "user", content: prompt ?? "", files: base64Files }, messageId);
          if (!data.rootMessageId) {
            data.rootMessageId = newUserMessageId;
          }
          messageToWriteToId = addChildren({ messages, rootMessageId: data.rootMessageId }, { from: "assistant", content: "" }, newUserMessageId);
        }
        const userMessage = messages.find((message) => message.id === messageId);
        const messageToWriteTo = messages.find((message) => message.id === messageToWriteToId);
        if (!messageToWriteTo) {
          throw new Error("Message to write to not found");
        }
        messageUpdatesAbortController = new AbortController();
        const streamingMode = resolveStreamingMode(store_get($$store_subs ??= {}, "$settings", settings));
        const messageUpdatesIterator = await fetchMessageUpdates(
          convId(),
          {
            base,
            inputs: prompt,
            messageId,
            isRetry,
            files: isRetry ? userMessage?.files : base64Files,
            selectedMcpServerNames: store_get($$store_subs ??= {}, "$enabledServers", enabledServers).map((s) => s.name),
            selectedMcpServers: store_get($$store_subs ??= {}, "$enabledServers", enabledServers).map((s) => ({ name: s.name, url: s.url, headers: s.headers })),
            streamingMode
          },
          messageUpdatesAbortController.signal
        ).catch((err) => {
          error.set(err.message);
        });
        if (messageUpdatesIterator === void 0) return;
        files = [];
        let buffer = "";
        let lastUpdateTime = /* @__PURE__ */ new Date();
        let frameFlushScheduled = false;
        const flushBuffer = (currentTime) => {
          if (buffer.length === 0) return;
          messageToWriteTo.content += buffer;
          buffer = "";
          lastUpdateTime = currentTime;
        };
        const scheduleFrameFlush = () => {
          if (frameFlushScheduled) return;
          frameFlushScheduled = true;
          const flush = () => {
            frameFlushScheduled = false;
            flushBuffer(/* @__PURE__ */ new Date());
          };
          if (typeof requestAnimationFrame === "function") {
            requestAnimationFrame(flush);
          } else {
            setTimeout(flush, 0);
          }
        };
        for await (const update of messageUpdatesIterator) {
          if (store_get($$store_subs ??= {}, "$isAborted", isAborted)) {
            messageUpdatesAbortController.abort();
            return;
          }
          if (update.type === MessageUpdateType.Stream) {
            update.token = update.token.replaceAll("\0", "");
          }
          const isKeepAlive = update.type === MessageUpdateType.Status && update.status === MessageUpdateStatus.KeepAlive;
          if (!isKeepAlive) {
            if (update.type === MessageUpdateType.Stream) {
              const existingUpdates = messageToWriteTo.updates ?? [];
              const lastUpdate = existingUpdates.at(-1);
              if (lastUpdate?.type === MessageUpdateType.Stream) {
                const merged = {
                  ...lastUpdate,
                  token: (lastUpdate.token ?? "") + (update.token ?? "")
                };
                messageToWriteTo.updates = [...existingUpdates.slice(0, -1), merged];
              } else {
                messageToWriteTo.updates = [...existingUpdates, update];
              }
            } else {
              messageToWriteTo.updates = [...messageToWriteTo.updates ?? [], update];
            }
          }
          const currentTime = /* @__PURE__ */ new Date();
          if (update.type !== MessageUpdateType.Stream && buffer.length > 0) {
            flushBuffer(currentTime);
          }
          if (update.type === MessageUpdateType.Stream) {
            buffer += update.token;
            if (streamingMode === "smooth") {
              scheduleFrameFlush();
            } else if (currentTime.getTime() - lastUpdateTime.getTime() > updateDebouncer.maxUpdateTime) {
              flushBuffer(currentTime);
            }
            if (pending) {
              streamStart();
            }
            pending = false;
          } else if (update.type === MessageUpdateType.FinalAnswer) {
            const finalText = update.text ?? "";
            const isInterrupted = update.interrupted === true;
            const hadTools = messageToWriteTo.updates?.some((u) => u.type === MessageUpdateType.Tool) ?? false;
            if (isInterrupted) {
              if (!messageToWriteTo.content) {
                messageToWriteTo.content = finalText;
              }
            } else if (hadTools) {
              const existing = messageToWriteTo.content;
              const trimmedExistingSuffix = existing.replace(/\s+$/, "");
              const trimmedFinalPrefix = finalText.replace(/^\s+/, "");
              const alreadyStreamed = finalText && (existing.endsWith(finalText) || trimmedFinalPrefix.length > 0 && trimmedExistingSuffix.endsWith(trimmedFinalPrefix));
              if (existing && existing.length > 0) {
                if (alreadyStreamed) {
                  messageToWriteTo.content = existing;
                } else if (finalText && (finalText.startsWith(existing) || trimmedExistingSuffix.length > 0 && trimmedFinalPrefix.startsWith(trimmedExistingSuffix))) {
                  messageToWriteTo.content = finalText;
                } else {
                  const needsGap = !/\n\n$/.test(existing) && !/^\n/.test(finalText ?? "");
                  messageToWriteTo.content = existing + (needsGap ? "\n\n" : "") + finalText;
                }
              } else {
                messageToWriteTo.content = finalText;
              }
            } else {
              messageToWriteTo.content = finalText;
            }
          } else if (update.type === MessageUpdateType.Status && update.status === MessageUpdateStatus.Error) {
            if (update.statusCode === 402) {
              showSubscribeModal = true;
            } else {
              store_set(error, update.message ?? "An error has occurred");
            }
          } else if (update.type === MessageUpdateType.Title) {
            const convInData = conversations.find(({ id }) => id === page.params.id);
            if (convInData) {
              convInData.title = update.title;
              store_set(titleUpdate, { title: update.title, convId: convId() });
            }
          } else if (update.type === MessageUpdateType.File) {
            messageToWriteTo.files = [
              ...messageToWriteTo.files ?? [],
              {
                type: "hash",
                value: update.sha,
                mime: update.mime,
                name: update.name
              }
            ];
          } else if (update.type === MessageUpdateType.RouterMetadata) {
            messageToWriteTo.routerMetadata = { route: update.route, model: update.model };
          }
        }
        if (buffer.length > 0) {
          flushBuffer(/* @__PURE__ */ new Date());
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("overloaded")) {
          store_set(error, "Too much traffic, please try again.");
        } else if (err instanceof Error && err.message.includes("429")) {
          store_set(error, ERROR_MESSAGES.rateLimited);
        } else if (err instanceof Error) {
          store_set(error, err.message);
        } else {
          store_set(error, ERROR_MESSAGES.default);
        }
        console.error(err);
      } finally {
        store_set(loading, false);
        pending = false;
        if (stopRequestPromise) {
          await stopRequestPromise.catch(() => {
          });
          stopRequestPromise = void 0;
        }
        await invalidateAll();
      }
    }
    async function stopGeneration() {
      stopRequested = true;
      store_set(isAborted, true);
      store_set(loading, false);
      messageUpdatesAbortController.abort();
      const lastAssistant = messages.findLast((m) => m.from === "assistant");
      if (lastAssistant) {
        lastAssistant.interrupted = true;
      }
      const sendStopRequest = async () => {
        const response = await fetch(`${base}/conversation/${page.params.id}/stop-generating`, { method: "POST" });
        if (!response.ok) {
          throw new Error(`Stop request failed: ${response.status}`);
        }
      };
      stopRequestPromise = (async () => {
        try {
          await sendStopRequest();
        } catch (firstErr) {
          try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            await sendStopRequest();
          } catch (retryErr) {
            console.error("Failed to stop generation", firstErr, retryErr);
            store_set(error, "Failed to stop generation. Please try again.");
          }
        }
      })();
      await stopRequestPromise;
    }
    async function onMessage(content) {
      await writeMessage({ prompt: content });
    }
    async function onRetry(payload) {
      if (requireAuthUser()) return;
      const lastMsgId = payload.id;
      messagesPath(createMessagesPath(messages, lastMsgId));
      await writeMessage({
        prompt: payload.content,
        messageId: payload.id,
        isRetry: true
      });
    }
    async function onShowAlternateMsg(payload) {
      const msgId = payload.id;
      messagesPath(createMessagesPath(messages, msgId));
    }
    const settings = useSettingsStore();
    let messages = data.messages;
    let messagesPath = derived(() => createMessagesPath(messages));
    let messagesAlternatives = derived(() => createMessagesAlternatives(messages));
    let title = derived(() => {
      const rawTitle = conversations.find((conv) => conv.id === page.params.id)?.title ?? data.title;
      return rawTitle ? rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1) : rawTitle;
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1djqiyk", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>${escape_html(title())}</title>`);
        });
      });
      ChatWindow($$renderer3, {
        loading: store_get($$store_subs ??= {}, "$loading", loading),
        pending,
        messages: messagesPath(),
        messagesAlternatives: messagesAlternatives(),
        shared: data.shared,
        preprompt: data.preprompt,
        onmessage: onMessage,
        onretry: onRetry,
        onshowAlternateMsg: onShowAlternateMsg,
        onstop: stopGeneration,
        models: data.models,
        currentModel: findCurrentModel(data.models, data.oldModels, data.model),
        get files() {
          return files;
        },
        set files($$value) {
          files = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (showSubscribeModal) {
        $$renderer3.push("<!--[0-->");
        SubscribeModal($$renderer3, { close: () => showSubscribeModal = false });
      } else {
        $$renderer3.push("<!--[-1-->");
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
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
