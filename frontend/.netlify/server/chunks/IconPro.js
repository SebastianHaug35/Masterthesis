import { w as writable } from "./index.js";
import { i as attr_class, g as attr, h as stringify } from "./root.js";
const isPro = writable(null);
function IconPro($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { classNames = "" } = $$props;
    const gradientId = `gradient-${Math.random().toString(36).slice(2, 9)}`;
    $$renderer2.push(`<svg${attr_class(`text-gray-500 ${stringify(classNames)}`)} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" width="1em" height="1em" viewBox="0 0 12 12"><defs><linearGradient${attr("id", gradientId)} x1="3.371" y1="3.43" x2="8.141" y2="8.9" gradientUnits="userSpaceOnUse"><stop stop-color="#FF0789"></stop><stop offset=".63" stop-color="#21DE75"></stop><stop offset="1" stop-color="#FF8D00"></stop></linearGradient></defs><path d="M6.481 1.26c0 1.55.67 2.58 1.5 3.24.86.68 1.9 1 2.58 1.07v.86a5.3 5.3 0 0 0-2.57 1.07 3.95 3.95 0 0 0-1.51 3.24h-.96c0-1.55-.67-2.58-1.5-3.24a5.3 5.3 0 0 0-2.58-1.07v-.86a5.3 5.3 0 0 0 2.57-1.07 3.95 3.95 0 0 0 1.51-3.24h.96Z"${attr("fill", `url(#${stringify(gradientId)})`)}></path></svg>`);
  });
}
export {
  IconPro as I,
  isPro as i
};
