import { c as config } from "./config.js";
function getApiToken(locals) {
  if (config.USE_USER_TOKEN === "true") {
    if (!locals?.token) {
      throw new Error("User token not found");
    }
    return locals.token;
  }
  return config.OPENAI_API_KEY || config.HF_TOKEN;
}
export {
  getApiToken as g
};
