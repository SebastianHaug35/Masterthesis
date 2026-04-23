import pino from "pino";
import { c as config } from "./config.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
const asyncLocalStorage = new AsyncLocalStorage();
function runWithRequestContext(fn, context = {}) {
  const fullContext = {
    requestId: context.requestId ?? randomUUID(),
    url: context.url,
    ip: context.ip,
    user: context.user,
    statusCode: context.statusCode
  };
  return asyncLocalStorage.run(fullContext, fn);
}
function updateRequestContext(updates) {
  const store = asyncLocalStorage.getStore();
  if (store) {
    Object.assign(store, updates);
  }
}
function getRequestContext() {
  return asyncLocalStorage.getStore();
}
let options = {};
const baseLogger = pino({
  ...options,
  messageKey: "message",
  level: config.LOG_LEVEL || "info",
  formatters: {
    level: (label) => {
      return { level: label };
    }
  },
  mixin() {
    const ctx = getRequestContext();
    if (!ctx) return {};
    const result = {};
    if (ctx.requestId) result.request_id = ctx.requestId;
    if (ctx.url) result.url = ctx.url;
    if (ctx.ip) result.ip = ctx.ip;
    if (ctx.user) result.user = ctx.user;
    if (ctx.statusCode) result.status_code = ctx.statusCode;
    return result;
  }
});
const logger = baseLogger;
export {
  logger as l,
  runWithRequestContext as r,
  updateRequestContext as u
};
