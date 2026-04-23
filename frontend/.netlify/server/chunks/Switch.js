import { g as attr, i as attr_class, h as stringify, l as bind_props, m as derived } from "./root.js";
function Switch($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { checked = void 0, name, size = "md" } = $$props;
    const trackClasses = derived(() => size === "sm" ? "h-3.5 w-6 p-0.5 peer-checked:[&>div]:translate-x-2.5" : "h-5 w-9 p-1 peer-checked:[&>div]:translate-x-3.5");
    const thumbClasses = derived(() => size === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5");
    $$renderer2.push(`<input${attr("checked", checked, true)} type="checkbox"${attr("name", name)} class="peer pointer-events-none absolute opacity-0"/> <div${attr("aria-checked", checked)} aria-roledescription="switch" aria-label="switch" role="switch" tabindex="0"${attr_class(`relative inline-flex shrink-0 cursor-pointer items-center rounded-full bg-gray-300 shadow-inner ring-gray-400 peer-checked:bg-blue-600 hover:bg-gray-400 peer-checked:hover:bg-blue-600 focus-visible:ring focus-visible:ring-offset-1 dark:bg-gray-600 dark:ring-gray-700 dark:hover:bg-gray-500 dark:peer-checked:hover:bg-blue-600 ${stringify(trackClasses())}`)}><div${attr_class(`rounded-full bg-white shadow-sm transition-transform ${stringify(thumbClasses())}`)}></div></div>`);
    bind_props($$props, { checked });
  });
}
export {
  Switch as S
};
