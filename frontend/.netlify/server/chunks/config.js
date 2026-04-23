import { b as private_env, p as public_env } from "./shared-server.js";
import { b as building } from "./environment.js";
var Semaphores = /* @__PURE__ */ ((Semaphores2) => {
  Semaphores2["CONVERSATION_STATS"] = "conversation.stats";
  Semaphores2["CONFIG_UPDATE"] = "config.update";
  Semaphores2["MIGRATION"] = "migration";
  Semaphores2["TEST_MIGRATION"] = "test.migration";
  Semaphores2["OAUTH_TOKEN_REFRESH"] = "oauth.token.refresh";
  return Semaphores2;
})(Semaphores || {});
const keysFromEnv = { ...public_env, ...private_env };
class ConfigManager {
  constructor() {
    this.keysFromDB = {};
    this.isInitialized = false;
  }
  async init() {
    if (this.isInitialized) return;
    if (building || false) {
      this.isInitialized = true;
      return;
    }
    const { getCollectionsEarly } = await import("./database.js");
    const collections = await getCollectionsEarly();
    this.configCollection = collections.config;
    this.semaphoreCollection = collections.semaphores;
    await this.checkForUpdates().then(() => {
      this.isInitialized = true;
    });
  }
  get ConfigManagerEnabled() {
    return private_env.ENABLE_CONFIG_MANAGER === "true" && true;
  }
  get isHuggingChat() {
    return this.get("PUBLIC_APP_ASSETS") === "huggingchat";
  }
  async checkForUpdates() {
    if (await this.isConfigStale()) {
      await this.updateConfig();
    }
  }
  async isConfigStale() {
    if (!this.lastConfigUpdate || !this.isInitialized) {
      return true;
    }
    const count = await this.semaphoreCollection?.countDocuments({
      key: Semaphores.CONFIG_UPDATE,
      updatedAt: { $gt: this.lastConfigUpdate }
    });
    return count !== void 0 && count > 0;
  }
  async updateConfig() {
    const configs = await this.configCollection?.find({}).toArray() ?? [];
    this.keysFromDB = configs.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {}
    );
    this.lastConfigUpdate = /* @__PURE__ */ new Date();
  }
  get(key) {
    if (!this.ConfigManagerEnabled) {
      return keysFromEnv[key] || "";
    }
    return this.keysFromDB[key] || keysFromEnv[key] || "";
  }
  async updateSemaphore() {
    await this.semaphoreCollection?.updateOne(
      { key: Semaphores.CONFIG_UPDATE },
      {
        $set: {
          updatedAt: /* @__PURE__ */ new Date()
        },
        $setOnInsert: {
          createdAt: /* @__PURE__ */ new Date()
        }
      },
      { upsert: true }
    );
  }
  async set(key, value) {
    if (!this.ConfigManagerEnabled) throw new Error("Config manager is disabled");
    await this.configCollection?.updateOne({ key }, { $set: { value } }, { upsert: true });
    this.keysFromDB[key] = value;
    await this.updateSemaphore();
  }
  async delete(key) {
    if (!this.ConfigManagerEnabled) throw new Error("Config manager is disabled");
    await this.configCollection?.deleteOne({ key });
    delete this.keysFromDB[key];
    await this.updateSemaphore();
  }
  async clear() {
    if (!this.ConfigManagerEnabled) throw new Error("Config manager is disabled");
    await this.configCollection?.deleteMany({});
    this.keysFromDB = {};
    await this.updateSemaphore();
  }
  getPublicConfig() {
    let config2 = {
      ...Object.fromEntries(
        Object.entries(keysFromEnv).filter(([key]) => key.startsWith("PUBLIC_"))
      )
    };
    if (this.ConfigManagerEnabled) {
      config2 = {
        ...config2,
        ...Object.fromEntries(
          Object.entries(this.keysFromDB).filter(([key]) => key.startsWith("PUBLIC_"))
        )
      };
    }
    const publicEnvKeys = Object.keys(public_env);
    return Object.fromEntries(
      Object.entries(config2).filter(([key]) => publicEnvKeys.includes(key))
    );
  }
}
const configManager = new ConfigManager();
const ready = (async () => {
  if (!building) {
    await configManager.init();
  }
})();
const config = new Proxy(configManager, {
  get(target, prop, receiver) {
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
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
    if (typeof prop === "string") {
      target.set(prop, value);
      return true;
    }
    return false;
  }
});
export {
  Semaphores as S,
  config as c,
  ready as r
};
