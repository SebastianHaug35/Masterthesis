import { i as attr_class, o as clsx } from "./root.js";
import { o as onDestroy } from "./index-server.js";
import "clsx";
import { C as Close } from "./close.js";
function Portal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="contents" hidden="">`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function Modal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      width = "max-w-sm",
      children,
      closeButton = false,
      disableFly = false,
      closeOnBackdrop = true,
      onclose
    } = $$props;
    onDestroy(() => {
      return;
    });
    Portal($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div role="presentation" tabindex="-1" class="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm dark:bg-black/50">`);
        if (disableFly) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div role="dialog" tabindex="-1"${attr_class(clsx([
            "scrollbar-custom relative mx-auto max-h-[95dvh] max-w-[90dvw] overflow-y-auto overflow-x-hidden rounded-2xl bg-white shadow-2xl outline-none dark:bg-gray-800 dark:text-gray-200",
            width
          ]))}>`);
          if (closeButton) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<button class="absolute right-4 top-4 z-50">`);
            Close($$renderer3, { class: "size-6 text-gray-700 dark:text-gray-300" });
            $$renderer3.push(`<!----></button>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> `);
          children?.($$renderer3);
          $$renderer3.push(`<!----></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div role="dialog" tabindex="-1"${attr_class(clsx([
            "scrollbar-custom relative mx-auto max-h-[95dvh] max-w-[90dvw] overflow-y-auto overflow-x-hidden rounded-2xl bg-white shadow-2xl outline-none dark:bg-gray-800 dark:text-gray-200",
            width
          ]))}>`);
          if (closeButton) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<button class="absolute right-4 top-4 z-50">`);
            Close($$renderer3, { class: "size-6 text-gray-700 dark:text-gray-300" });
            $$renderer3.push(`<!----></button>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> `);
          children?.($$renderer3);
          $$renderer3.push(`<!----></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      }
    });
  });
}
export {
  Modal as M
};
