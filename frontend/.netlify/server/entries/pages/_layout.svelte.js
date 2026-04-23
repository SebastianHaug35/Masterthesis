import { d as sanitize_props, f as attributes, g as attr, h as stringify, i as attr_class, e as escape_html, j as ensure_array_like, k as store_get, u as unsubscribe_stores, l as bind_props, m as derived, o as clsx, n as noop, p as state, q as render_effect, t as set, v as deferred, w as get, x as attr_style, y as setContext, z as head, A as store_set } from "../../chunks/root.js";
import { o as onDestroy } from "../../chunks/index-server.js";
import { g as goto } from "../../chunks/client.js";
import { b as base } from "../../chunks/server.js";
import "../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import { p as page } from "../../chunks/index2.js";
import { e as error } from "../../chunks/errors.js";
import { c as createSettingsStore } from "../../chunks/settings2.js";
import { l as loading } from "../../chunks/loading.js";
import { L as Logo, e as enabledServersCount } from "../../chunks/shareModal.js";
import { T as Trash_can } from "../../chunks/trash-can.js";
import { h as html } from "../../chunks/html.js";
import "@sveltejs/kit/internal";
import "../../chunks/utils.js";
import "../../chunks/exports.js";
import "clsx";
import { u as usePublicConfig } from "../../chunks/PublicConfig.svelte.js";
import { u as useAPIClient, h as handleResponse } from "../../chunks/APIClient.js";
import { I as IconPro, i as isPro } from "../../chunks/IconPro.js";
function Edit($$renderer, $$props) {
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
  )}>${html(`<path fill="currentColor" d="M2 26h28v2H2zM25.4 9c.8-.8.8-2 0-2.8l-3.6-3.6c-.8-.8-2-.8-2.8 0l-15 15V24h6.4zm-5-5L24 7.6l-3 3L17.4 7zM6 22v-3.6l10-10l3.6 3.6l-10 10z"/>`)}</svg>`);
}
function NavConversationItem($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      conv,
      readOnly
    } = $$props;
    $$renderer2.push(`<a data-sveltekit-noscroll="" data-sveltekit-preload-data="tap"${attr("href", `${stringify(base)}/conversation/${stringify(conv.id)}`)}${attr_class(`group flex h-[2.08rem] flex-none items-center gap-1.5 rounded-lg pl-2 pr-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 max-sm:h-10 ${stringify(conv.id === page.params.id ? "bg-gray-100 dark:bg-gray-700" : "")}`)}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="my-2 min-w-0 flex-1 truncate first-letter:uppercase"><span>${escape_html(conv.title)}</span></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (!readOnly && true) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button type="button" class="flex h-5 w-5 items-center justify-center rounded md:hidden md:group-hover:flex" title="Edit conversation title">`);
      Edit($$renderer2, {
        class: "text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
      });
      $$renderer2.push(`<!----></button> <button type="button" class="flex h-5 w-5 items-center justify-center rounded md:hidden md:group-hover:flex" title="Delete conversation">`);
      Trash_can($$renderer2, {
        class: "text-xs text-gray-400  hover:text-gray-500 dark:hover:text-gray-300"
      });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></a> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function InfiniteScroll($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="h-2"></div>`);
  });
}
const titles = {
  today: "Today",
  week: "This week",
  month: "This month",
  older: "Older"
};
function NavMenu($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const publicConfig = usePublicConfig();
    useAPIClient();
    let {
      conversations = void 0,
      user,
      p = 0,
      ondeleteConversation,
      oneditConversationTitle
    } = $$props;
    const dateRanges = [
      (/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() - 1),
      (/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() - 7),
      (/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() - 1)
    ];
    let groupedConversations = derived(() => ({
      today: conversations.filter(({ updatedAt }) => updatedAt.getTime() > dateRanges[0]),
      week: conversations.filter(({ updatedAt }) => updatedAt.getTime() > dateRanges[1] && updatedAt.getTime() < dateRanges[0]),
      month: conversations.filter(({ updatedAt }) => updatedAt.getTime() > dateRanges[2] && updatedAt.getTime() < dateRanges[1]),
      older: conversations.filter(({ updatedAt }) => updatedAt.getTime() < dateRanges[2])
    }));
    const nModels = page.data.models.filter((el) => !el.unlisted).length;
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="sticky top-0 flex flex-none touch-none items-center justify-between px-1.5 py-3.5 max-sm:pt-0"><a class="flex select-none items-center rounded-xl text-lg font-semibold"${attr("href", `${stringify(publicConfig.PUBLIC_ORIGIN)}${stringify(base)}/`)}>`);
    Logo($$renderer2, { classNames: "dark:invert mr-[2px]" });
    $$renderer2.push(`<!----> ${escape_html(publicConfig.PUBLIC_APP_NAME)}</a> <a${attr("href", `${base}/`)} class="flex rounded-lg border bg-white px-2 py-0.5 text-center shadow-sm hover:shadow-none dark:border-gray-600 dark:bg-gray-700 sm:text-smd" title="Ctrl/Cmd + Shift + O">New Chat</a></div> <div class="scrollbar-custom flex touch-pan-y flex-col gap-1 overflow-y-auto rounded-r-xl border border-l-0 border-gray-100 from-gray-50 px-3 pb-3 pt-2 text-[.9rem] dark:border-transparent dark:from-gray-800/30 max-sm:bg-gradient-to-t md:bg-gradient-to-l"><div class="flex flex-col gap-0.5"><!--[-->`);
    const each_array = ensure_array_like(Object.entries(groupedConversations()));
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let [group, convs] = each_array[$$index_1];
      if (convs.length) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<h4 class="mb-1.5 mt-4 pl-0.5 text-sm text-gray-400 first:mt-0 dark:text-gray-500">${escape_html(titles[group])}</h4> <!--[-->`);
        const each_array_1 = ensure_array_like(convs);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let conv = each_array_1[$$index];
          NavConversationItem($$renderer2, { conv });
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[0-->");
      InfiniteScroll($$renderer2);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex touch-none flex-col gap-1 rounded-r-xl border border-l-0 border-gray-100 p-3 text-sm dark:border-transparent md:mt-3 md:bg-gradient-to-l md:from-gray-50 md:dark:from-gray-800/30">`);
    if (user?.username || user?.email) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="group flex h-9 items-center gap-1.5 rounded-lg pl-2 pr-2 hover:bg-gray-100 first:hover:bg-transparent sm:h-[2.08rem] dark:hover:bg-gray-700 first:dark:hover:bg-transparent"><img${attr("src", `https://huggingface.co/api/users/${stringify(user.username)}/avatar?redirect=true`)} class="size-3.5 rounded-full border bg-gray-500 dark:border-white/40" alt=""/> `);
      if (publicConfig.isHuggingChat && user?.username) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", `https://huggingface.co/${stringify(user.username)}`)} target="_blank" rel="noopener noreferrer" class="flex flex-none shrink items-center gap-1.5 truncate pr-2 text-gray-500 hover:underline dark:text-gray-400">${escape_html(user.username)}</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span class="flex flex-none shrink items-center gap-1.5 truncate pr-2 text-gray-500 dark:text-gray-400">${escape_html(user?.username || user?.email)}</span>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (publicConfig.isHuggingChat && store_get($$store_subs ??= {}, "$isPro", isPro) === false) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="https://huggingface.co/subscribe/pro?from=HuggingChat" target="_blank" rel="noopener noreferrer" class="ml-auto flex h-[20px] items-center gap-1 px-1.5 py-0.5 text-xs text-gray-500 dark:text-gray-400">`);
        IconPro($$renderer2, {});
        $$renderer2.push(`<!----> Get PRO</a>`);
      } else if (publicConfig.isHuggingChat && store_get($$store_subs ??= {}, "$isPro", isPro) === true) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<span class="ml-auto flex h-[20px] items-center gap-1 px-1.5 py-0.5 text-xs text-gray-500 dark:text-gray-400">`);
        IconPro($$renderer2, {});
        $$renderer2.push(`<!----> PRO</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <a${attr("href", `${stringify(base)}/models`)} class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-2 pr-2 text-gray-500 hover:bg-gray-100 sm:h-[2.08rem] dark:text-gray-400 dark:hover:bg-gray-700">Models <span class="ml-auto rounded-md bg-gray-500/5 px-1.5 py-0.5 text-xs text-gray-400 dark:bg-gray-500/20 dark:text-gray-400">${escape_html(nModels)}</span></a> `);
    if (user?.username || user?.email) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-2 pr-2 text-gray-500 hover:bg-gray-100 sm:h-[2.08rem] dark:text-gray-400 dark:hover:bg-gray-700">MCP Servers `);
      if (store_get($$store_subs ??= {}, "$enabledServersCount", enabledServersCount) > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="ml-auto rounded-md bg-blue-600/10 px-1.5 py-0.5 text-xs text-blue-600 dark:bg-blue-600/20 dark:text-blue-400">${escape_html(store_get($$store_subs ??= {}, "$enabledServersCount", enabledServersCount))}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <span class="flex gap-1"><a${attr("href", `${stringify(base)}/settings/application`)} class="flex h-9 flex-none flex-grow items-center gap-1.5 rounded-lg pl-2 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">Settings</a> <button aria-label="Toggle theme" class="flex size-9 min-w-[1.5em] flex-none items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button></span></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { conversations, p });
  });
}
function IconNew($$renderer, $$props) {
  let { classNames = "" } = $$props;
  $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg"${attr_class(clsx(classNames))} width="1em" height="1em" fill="none" viewBox="0 0 16 16"><path d="M7.258 1.856c.333 0 .66.024.979.07-.558.319-.972.86-1.123 1.503A5.254 5.254 0 1 0 9.32 13.513l.275-.127c.334-.17.712-.229 1.08-.17l.158.031.01.003 1.343.36-.359-1.345a1.77 1.77 0 0 1 .137-1.247 5.23 5.23 0 0 0 .538-2.041 2.356 2.356 0 0 0 1.544-1 6.808 6.808 0 0 1-.676 3.742v.001c-.034.066-.031.116-.025.14l.36 1.345a1.572 1.572 0 0 1-1.823 1.945l-.1-.024-1.334-.357a.2.2 0 0 0-.14.018l-.012.005A6.825 6.825 0 1 1 7.259 1.856Zm4.837-1.36c.434 0 .785.352.785.786v1.905h1.9a.785.785 0 0 1 0 1.57h-1.9v1.9a.786.786 0 1 1-1.57 0v-1.9H9.404a.785.785 0 0 1 0-1.57h1.906V1.282c0-.434.352-.787.785-.787Z" fill="currentColor"></path></svg>`);
}
function IconShare($$renderer, $$props) {
  let { classNames = "" } = $$props;
  $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg"${attr_class(clsx(classNames))} width="1em" height="1em" fill="none" viewBox="0 0 12 12"><path d="M10.4646 6.85139C10.7605 6.85139 11 7.09093 11 7.38679V7.78965C11 8.35479 11.0013 8.82459 10.9581 9.20053C10.9136 9.58762 10.8165 9.94247 10.5745 10.2495C10.478 10.3719 10.3672 10.4826 10.2448 10.5791C9.93774 10.8212 9.58211 10.9183 9.19497 10.9628C8.81915 11.006 8.34979 11.0055 7.78496 11.0055H4.21503C3.6502 11.0055 3.18083 11.006 2.80502 10.9628C2.41788 10.9183 2.06224 10.8212 1.75515 10.5791C1.63274 10.4826 1.52198 10.3718 1.42554 10.2495C1.18354 9.94248 1.08635 9.58761 1.04186 9.20053C0.998661 8.82458 1 8.35479 1 7.78965V7.38679C1.00003 7.09093 1.23954 6.85139 1.53541 6.85139C1.83128 6.85139 2.07078 7.09093 2.07081 7.38679V7.78965C2.07081 8.38023 2.07202 8.77788 2.10656 9.07845C2.13978 9.36728 2.19822 9.49857 2.26701 9.58595C2.31143 9.64228 2.3625 9.69333 2.41873 9.73767C2.50614 9.80657 2.63774 9.86487 2.9271 9.89812C3.2276 9.93264 3.62467 9.93387 4.21503 9.93387H7.78496C8.37532 9.93387 8.77238 9.93264 9.07289 9.89812C9.36227 9.86487 9.49384 9.80658 9.58126 9.73767C9.63752 9.69329 9.68862 9.64222 9.73298 9.58595C9.80176 9.49856 9.86021 9.3673 9.89343 9.07845C9.92796 8.77788 9.92918 8.38023 9.92918 7.78965V7.38679C9.92921 7.09093 10.1687 6.85139 10.4646 6.85139ZM6.01046 1.00034C6.15239 1.0004 6.2885 1.05697 6.3889 1.15729L9.36849 4.13601C9.57767 4.34519 9.57759 4.68454 9.36849 4.89377C9.15925 5.10283 8.8199 5.10294 8.61073 4.89377L6.54586 2.8289V8.02945C6.54586 8.32526 6.30624 8.56559 6.01046 8.56572C5.71472 8.56555 5.47418 8.32523 5.47418 8.02945V2.8289L3.40931 4.89377C3.20011 5.10268 2.86157 5.10279 2.65243 4.89377C2.44341 4.68459 2.44341 4.34519 2.65243 4.13601L5.63114 1.15729C5.73154 1.0569 5.86848 1.00042 6.01046 1.00034Z" fill="currentColor"></path></svg>`);
}
function IconBurger($$renderer, $$props) {
  let { classNames = "" } = $$props;
  $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg"${attr_class(clsx(classNames))} width="1em" height="1em" fill="none" viewBox="0 0 16 16"><path d="M8.795 10.418a.84.84 0 1 1 0 1.681H1.907a.84.84 0 0 1 0-1.681h6.888ZM14.093 3.9a.841.841 0 0 1 0 1.682H1.907a.84.84 0 0 1 0-1.682h12.186Z" fill="currentColor"></path></svg>`);
}
const now = () => Date.now();
const raf = {
  // don't access requestAnimationFrame eagerly outside method
  // this allows basic testing of user code without JSDOM
  // bunder will eval and remove ternary when the user's app is built
  tick: (
    /** @param {any} _ */
    (_) => noop()
  ),
  now: () => now(),
  tasks: /* @__PURE__ */ new Set()
};
function loop(callback) {
  let task;
  if (raf.tasks.size === 0) ;
  return {
    promise: new Promise((fulfill) => {
      raf.tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      raf.tasks.delete(task);
    }
  };
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function tick_spring(ctx, last_value, current_value, target_value) {
  if (typeof current_value === "number" || is_date(current_value)) {
    const delta = target_value - current_value;
    const velocity = (current_value - last_value) / (ctx.dt || 1 / 60);
    const spring = ctx.opts.stiffness * delta;
    const damper = ctx.opts.damping * velocity;
    const acceleration = (spring - damper) * ctx.inv_mass;
    const d = (velocity + acceleration) * ctx.dt;
    if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
      return target_value;
    } else {
      ctx.settled = false;
      return is_date(current_value) ? new Date(current_value.getTime() + d) : current_value + d;
    }
  } else if (Array.isArray(current_value)) {
    return current_value.map(
      (_, i) => (
        // @ts-ignore
        tick_spring(ctx, last_value[i], current_value[i], target_value[i])
      )
    );
  } else if (typeof current_value === "object") {
    const next_value = {};
    for (const k in current_value) {
      next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
    }
    return next_value;
  } else {
    throw new Error(`Cannot spring ${typeof current_value} values`);
  }
}
class Spring {
  #stiffness = state(0.15);
  #damping = state(0.8);
  #precision = state(0.01);
  #current;
  #target;
  #last_value = (
    /** @type {T} */
    void 0
  );
  #last_time = 0;
  #inverse_mass = 1;
  #momentum = 0;
  /** @type {import('../internal/client/types').Task | null} */
  #task = null;
  /** @type {ReturnType<typeof deferred> | null} */
  #deferred = null;
  /**
   * @param {T} value
   * @param {SpringOpts} [options]
   */
  constructor(value, options = {}) {
    this.#current = state(value);
    this.#target = state(value);
    if (typeof options.stiffness === "number") this.#stiffness.v = clamp(options.stiffness, 0, 1);
    if (typeof options.damping === "number") this.#damping.v = clamp(options.damping, 0, 1);
    if (typeof options.precision === "number") this.#precision.v = options.precision;
  }
  /**
   * Create a spring whose value is bound to the return value of `fn`. This must be called
   * inside an effect root (for example, during component initialisation).
   *
   * ```svelte
   * <script>
   * 	import { Spring } from 'svelte/motion';
   *
   * 	let { number } = $props();
   *
   * 	const spring = Spring.of(() => number);
   * <\/script>
   * ```
   * @template U
   * @param {() => U} fn
   * @param {SpringOpts} [options]
   */
  static of(fn, options) {
    const spring = new Spring(fn(), options);
    render_effect(() => {
      spring.set(fn());
    });
    return spring;
  }
  /** @param {T} value */
  #update(value) {
    set(this.#target, value);
    this.#current.v ??= value;
    this.#last_value ??= this.#current.v;
    if (!this.#task) {
      this.#last_time = raf.now();
      var inv_mass_recovery_rate = 1e3 / (this.#momentum * 60);
      this.#task ??= loop((now2) => {
        this.#inverse_mass = Math.min(this.#inverse_mass + inv_mass_recovery_rate, 1);
        const elapsed = Math.min(now2 - this.#last_time, 1e3 / 30);
        const ctx = {
          inv_mass: this.#inverse_mass,
          opts: {
            stiffness: this.#stiffness.v,
            damping: this.#damping.v,
            precision: this.#precision.v
          },
          settled: true,
          dt: elapsed * 60 / 1e3
        };
        var next = tick_spring(ctx, this.#last_value, this.#current.v, this.#target.v);
        this.#last_value = this.#current.v;
        this.#last_time = now2;
        set(this.#current, next);
        if (ctx.settled) {
          this.#task = null;
        }
        return !ctx.settled;
      });
    }
    return this.#task.promise;
  }
  /**
   * Sets `spring.target` to `value` and returns a `Promise` that resolves if and when `spring.current` catches up to it.
   *
   * If `options.instant` is `true`, `spring.current` immediately matches `spring.target`.
   *
   * If `options.preserveMomentum` is provided, the spring will continue on its current trajectory for
   * the specified number of milliseconds. This is useful for things like 'fling' gestures.
   *
   * @param {T} value
   * @param {SpringUpdateOpts} [options]
   */
  set(value, options) {
    this.#deferred?.reject(new Error("Aborted"));
    if (options?.instant || this.#current.v === void 0) {
      this.#task?.abort();
      this.#task = null;
      set(this.#current, set(this.#target, value));
      this.#last_value = value;
      return Promise.resolve();
    }
    if (options?.preserveMomentum) {
      this.#inverse_mass = 0;
      this.#momentum = options.preserveMomentum;
    }
    var d = this.#deferred = deferred();
    d.promise.catch(noop);
    this.#update(value).then(() => {
      if (d !== this.#deferred) return;
      d.resolve(void 0);
    });
    return d.promise;
  }
  get current() {
    return get(this.#current);
  }
  get damping() {
    return get(this.#damping);
  }
  set damping(v) {
    set(this.#damping, clamp(v, 0, 1));
  }
  get precision() {
    return get(this.#precision);
  }
  set precision(v) {
    set(this.#precision, v);
  }
  get stiffness() {
    return get(this.#stiffness);
  }
  set stiffness(v) {
    set(this.#stiffness, clamp(v, 0, 1));
  }
  get target() {
    return get(this.#target);
  }
  set target(v) {
    this.set(v);
  }
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function MobileNav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { title = void 0, children } = $$props;
    const isHuggingChat = derived(() => Boolean(page.data?.publicConfig?.isHuggingChat));
    const canShare = derived(() => isHuggingChat() && !store_get($$store_subs ??= {}, "$loading", loading) && Boolean(page.params?.id) && page.route.id?.startsWith("/conversation/"));
    const drawerWidthPercentage = 85;
    let isDragging = false;
    const springTarget = derived(() => -100);
    const tween = Spring.of(() => springTarget(), { stiffness: 0.2, damping: 0.8 });
    onDestroy(() => {
    });
    $$renderer2.push(`<nav class="mx-4 mt-4 flex h-12 items-center justify-between rounded-b-xl border-b bg-gray-50 px-3 dark:border-gray-800 dark:bg-gray-800/30 dark:shadow-xl max-md:rounded-xl max-md:border md:hidden"><button type="button" class="-ml-3 flex size-12 shrink-0 items-center justify-center text-lg" aria-label="Open menu">`);
    IconBurger($$renderer2, {});
    $$renderer2.push(`<!----></button> <div class="flex h-full items-center justify-center overflow-hidden">`);
    if (page.params?.id) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="max-w-full truncate px-4 first-letter:uppercase" data-testid="chat-title">${escape_html(title)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="-mr-3 flex items-center">`);
    if (isHuggingChat()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button type="button" class="flex h-12 w-6 shrink-0 items-center justify-center text-lg"${attr("disabled", !canShare(), true)} aria-label="Share conversation">`);
      IconShare($$renderer2, { classNames: !canShare() ? "opacity-40" : "" });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <a${attr("href", `${stringify(base)}/`)} class="flex size-12 shrink-0 items-center justify-center text-lg">`);
    IconNew($$renderer2, {});
    $$renderer2.push(`<!----></a></div></nav> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <nav${attr_style(`transform: translateX(${stringify(tween.current)}%); width: ${stringify(drawerWidthPercentage)}%; will-change: transform;`)}${attr_class("fixed bottom-0 left-0 top-0 z-30 grid max-h-dvh grid-cols-1 grid-rows-[auto,1fr,auto,auto] rounded-r-xl bg-white pt-4 dark:bg-gray-900 md:hidden", void 0, {
      "shadow-[5px_0_15px_0_rgba(0,0,0,0.3)]": isDragging
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></nav>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { title });
  });
}
function ExpandNavigation($$renderer, $$props) {
  let { classNames } = $$props;
  $$renderer.push(`<button${attr("title", "Collapse sidebar")}${attr_class(`${stringify(classNames)} group flex h-16 w-6 flex-col items-center justify-center -space-y-1 outline-none *:h-3 *:w-1 *:rounded-full *:hover:bg-gray-400 dark:*:hover:bg-gray-400 max-md:hidden ${stringify(
    "*:bg-gray-300/70 dark:*:bg-gray-600"
  )}`)} name="sidebar-toggle" aria-label="Toggle sidebar navigation"><div${attr_class(clsx(
    "group-hover:rotate-[20deg]"
  ))}></div> <div${attr_class(clsx(
    "group-hover:-rotate-[20deg]"
  ))}></div></button>`);
}
function BackgroundGenerationPoller($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    useAPIClient();
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data = void 0, children } = $$props;
    setContext("publicConfig", data.publicConfig);
    const publicConfig = data.publicConfig;
    const client = useAPIClient();
    let conversations = data.conversations;
    let errorToastTimeout;
    let canShare = derived(() => publicConfig.isHuggingChat && Boolean(page.params?.id) && page.route.id?.startsWith("/conversation/"));
    async function deleteConversation(id) {
      client.conversations({ id }).delete().then(handleResponse).then(async () => {
        conversations = conversations.filter((conv) => conv.id !== id);
        if (page.params.id === id) {
          await goto(`${base}/`, {});
        }
      }).catch((err) => {
        console.error(err);
        store_set(error, String(err));
      });
    }
    async function editConversationTitle(id, title) {
      client.conversations({ id }).patch({ title }).then(handleResponse).then(async () => {
        conversations = conversations.map((conv) => conv.id === id ? { ...conv, title } : conv);
      }).catch((err) => {
        console.error(err);
        store_set(error, String(err));
      });
    }
    onDestroy(() => {
      clearTimeout(errorToastTimeout);
    });
    createSettingsStore(data.settings);
    let mobileNavTitle = derived(() => ["/models", "/privacy"].includes(page.route.id ?? "") ? "" : conversations.find((conv) => conv.id === page.params.id)?.title);
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(publicConfig.PUBLIC_APP_NAME)} - Chat with AI models</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", publicConfig.PUBLIC_APP_DESCRIPTION)}/> <meta name="twitter:site" content="@huggingface"/>  `);
      if (!page.url.pathname.includes("/models/")) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:title"${attr("content", `${stringify(publicConfig.PUBLIC_APP_NAME)} - Chat with AI models`)}/> <meta name="twitter:description"${attr("content", publicConfig.PUBLIC_APP_DESCRIPTION)}/> <meta name="twitter:image"${attr("content", `${stringify(publicConfig.PUBLIC_ORIGIN || page.url.origin)}${stringify(publicConfig.assetPath)}/thumbnail.png`)}/> <meta name="twitter:image:alt"${attr("content", `${stringify(publicConfig.PUBLIC_APP_NAME)} preview`)}/> <meta property="og:title"${attr("content", `${stringify(publicConfig.PUBLIC_APP_NAME)} - Chat with AI models`)}/> <meta property="og:type" content="website"/> <meta property="og:url"${attr("content", `${stringify(publicConfig.PUBLIC_ORIGIN || page.url.origin)}${stringify(base)}`)}/> <meta property="og:image"${attr("content", `${stringify(publicConfig.assetPath)}/thumbnail.png`)}/> <meta property="og:description"${attr("content", publicConfig.PUBLIC_APP_DESCRIPTION)}/> <meta property="og:site_name"${attr("content", publicConfig.PUBLIC_APP_NAME)}/> <meta property="og:locale" content="en_US"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <link rel="icon"${attr("href", `${stringify(publicConfig.assetPath)}/icon.svg`)} type="image/svg+xml"/> `);
      if (publicConfig.PUBLIC_ORIGIN) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<link rel="icon"${attr("href", `${stringify(publicConfig.assetPath)}/favicon.svg`)} type="image/svg+xml" media="(prefers-color-scheme: light)"/> <link rel="icon"${attr("href", `${stringify(publicConfig.assetPath)}/favicon-dark.svg`)} type="image/svg+xml" media="(prefers-color-scheme: dark)"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<link rel="icon"${attr("href", `${stringify(publicConfig.assetPath)}/favicon-dev.svg`)} type="image/svg+xml"/>`);
      }
      $$renderer3.push(`<!--]--> <link rel="apple-touch-icon"${attr("href", `${stringify(publicConfig.assetPath)}/apple-touch-icon.png`)}/> <link rel="manifest"${attr("href", `${stringify(publicConfig.assetPath)}/manifest.json`)}/> `);
      if (publicConfig.PUBLIC_PLAUSIBLE_SCRIPT_URL) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<script async=""${attr("src", publicConfig.PUBLIC_PLAUSIBLE_SCRIPT_URL)}><\/script>`);
        $$renderer3.push(`<!---->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (publicConfig.PUBLIC_APPLE_APP_ID) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta name="apple-itunes-app"${attr("content", `app-id=${publicConfig.PUBLIC_APPLE_APP_ID}`)}/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    });
    BackgroundGenerationPoller($$renderer2);
    $$renderer2.push(`<!----> <div${attr_class(`fixed grid h-dvh w-screen grid-cols-1 grid-rows-[auto,1fr] overflow-hidden text-smd ${stringify("md:grid-cols-[290px,1fr]")} transition-[300ms] [transition-property:grid-template-columns] dark:text-gray-300 md:grid-rows-[1fr]`)}>`);
    ExpandNavigation($$renderer2, {
      classNames: `absolute inset-y-0 z-10 my-auto ${stringify("left-[290px]")} *:transition-transform`
    });
    $$renderer2.push(`<!----> `);
    if (canShare()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button type="button"${attr_class(`hidden size-8 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/90 text-sm font-medium text-gray-700 shadow-sm hover:bg-white/60 hover:text-gray-500 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700 md:absolute md:right-6 md:top-5 md:flex ${stringify(store_get($$store_subs ??= {}, "$loading", loading) ? "cursor-not-allowed opacity-40" : "")}`)} aria-label="Share conversation"${attr("disabled", store_get($$store_subs ??= {}, "$loading", loading), true)}>`);
      IconShare($$renderer2, {});
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    MobileNav($$renderer2, {
      title: mobileNavTitle(),
      children: ($$renderer3) => {
        NavMenu($$renderer3, {
          conversations,
          user: data.user,
          ondeleteConversation: (id) => deleteConversation(id),
          oneditConversationTitle: (payload) => editConversationTitle(payload.id, payload.title)
        });
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <nav class="grid max-h-dvh grid-cols-1 grid-rows-[auto,1fr,auto] overflow-hidden *:w-[290px] max-md:hidden">`);
    NavMenu($$renderer2, {
      conversations,
      user: data.user,
      ondeleteConversation: (id) => deleteConversation(id),
      oneditConversationTitle: (payload) => editConversationTitle(payload.id, payload.title)
    });
    $$renderer2.push(`<!----></nav> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    children?.($$renderer2);
    $$renderer2.push(`<!----> `);
    if (publicConfig.PUBLIC_PLAUSIBLE_SCRIPT_URL) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<script>
			(window.plausible =
				window.plausible ||
				function () {
					(plausible.q = plausible.q || []).push(arguments);
				}),
				(plausible.init =
					plausible.init ||
					function (i) {
						plausible.o = i || {};
					});
			plausible.init();
		<\/script>`);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _layout as default
};
