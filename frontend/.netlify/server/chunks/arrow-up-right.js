import { d as sanitize_props, f as attributes } from "./root.js";
import { h as html } from "./html.js";
function Arrow_up_right($$renderer, $$props) {
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
  )}>${html(`<path fill="currentColor" d="M10 6v2h12.59L6 24.59L7.41 26L24 9.41V22h2V6z"/>`)}</svg>`);
}
export {
  Arrow_up_right as A
};
