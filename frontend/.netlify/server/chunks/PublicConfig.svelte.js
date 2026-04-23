import "clsx";
import { D as getContext } from "./root.js";
import { p as page } from "./index2.js";
import { b as base } from "./server.js";
import "./url.js";
import "@sveltejs/kit/internal/server";
class PublicConfigManager {
  #configStore = {};
  constructor(initialConfig) {
    this.init = this.init.bind(this);
    this.getPublicConfig = this.getPublicConfig.bind(this);
    if (initialConfig) {
      this.init(initialConfig);
    }
  }
  init(publicConfig) {
    this.#configStore = publicConfig;
  }
  get(key) {
    return this.#configStore[key];
  }
  getPublicConfig() {
    return this.#configStore;
  }
  get isHuggingChat() {
    return this.#configStore.PUBLIC_APP_ASSETS === "huggingchat";
  }
  get assetPath() {
    return (this.#configStore.PUBLIC_ORIGIN || page.url.origin) + base + "/" + (this.#configStore.PUBLIC_APP_ASSETS || "chatui");
  }
}
function getConfigManager(initialConfig) {
  const publicConfigManager = new PublicConfigManager(initialConfig);
  const publicConfig = new Proxy(publicConfigManager, {
    get(target, prop) {
      if (prop in target) {
        return Reflect.get(target, prop);
      }
      if (typeof prop === "string") {
        return target.get(prop);
      }
      return void 0;
    },
    set(target, prop, value, receiver) {
      if (prop in target) {
        return Reflect.set(target, prop, value, receiver);
      }
      return false;
    }
  });
  return publicConfig;
}
const publicConfigTransporter = {
  encode: (value) => value instanceof PublicConfigManager ? JSON.stringify(value.getPublicConfig()) : false,
  decode: (value) => getConfigManager(JSON.parse(value))
};
const usePublicConfig = () => getContext("publicConfig");
export {
  getConfigManager as g,
  publicConfigTransporter as p,
  usePublicConfig as u
};
