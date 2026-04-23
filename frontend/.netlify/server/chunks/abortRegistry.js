import { l as logger } from "./logger.js";
class AbortRegistry {
  constructor() {
    this.controllers = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!AbortRegistry.instance) {
      AbortRegistry.instance = new AbortRegistry();
    }
    return AbortRegistry.instance;
  }
  register(conversationId, controller) {
    const key = conversationId.toString();
    let set = this.controllers.get(key);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      this.controllers.set(key, set);
    }
    set.add(controller);
    controller.signal.addEventListener(
      "abort",
      () => {
        this.unregister(key, controller);
      },
      { once: true }
    );
  }
  abort(conversationId) {
    const set = this.controllers.get(conversationId);
    if (!set?.size) return;
    logger.debug({ conversationId }, "Aborting active generation via AbortRegistry");
    for (const controller of set) {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    }
    this.controllers.delete(conversationId);
  }
  unregister(conversationId, controller) {
    const set = this.controllers.get(conversationId);
    if (!set) return;
    set.delete(controller);
    if (set.size === 0) {
      this.controllers.delete(conversationId);
    }
  }
}
export {
  AbortRegistry as A
};
