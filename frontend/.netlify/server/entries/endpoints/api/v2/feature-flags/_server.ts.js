import { s as superjsonResponse } from "../../../../../chunks/superjsonResponse.js";
import { l as loginEnabled } from "../../../../../chunks/auth.js";
import { c as config } from "../../../../../chunks/config.js";
const GET = async ({ locals }) => {
  return superjsonResponse({
    enableAssistants: config.ENABLE_ASSISTANTS === "true",
    loginEnabled,
    isAdmin: locals.isAdmin,
    transcriptionEnabled: !!config.get("TRANSCRIPTION_MODEL")
  });
};
export {
  GET
};
