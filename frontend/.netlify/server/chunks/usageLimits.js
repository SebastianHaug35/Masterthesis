import { z } from "zod";
import { c as config } from "./config.js";
import JSON5 from "json5";
const sanitizeJSONEnv = (val, fallback) => {
  const raw = (val ?? "").trim();
  const unquoted = raw.startsWith("`") && raw.endsWith("`") ? raw.slice(1, -1) : raw;
  return unquoted || fallback;
};
const usageLimitsSchema = z.object({
  conversations: z.coerce.number().optional(),
  // how many conversations
  messages: z.coerce.number().optional(),
  // how many messages in a conversation
  messageLength: z.coerce.number().optional(),
  // how long can a message be before we cut it off
  messagesPerMinute: z.preprocess((val) => {
    if (val === void 0) {
      return config.RATE_LIMIT;
    }
    return val;
  }, z.coerce.number().optional()).optional()
  // how many messages per minute
}).optional();
const usageLimits = usageLimitsSchema.parse(
  JSON5.parse(sanitizeJSONEnv(config.USAGE_LIMITS, "{}"))
);
export {
  usageLimits as u
};
