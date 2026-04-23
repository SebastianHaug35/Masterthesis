import { t as triggerOauthFlow } from "../../../chunks/auth.js";
async function GET(event) {
  return await triggerOauthFlow(event);
}
export {
  GET
};
