import { w as writable } from "./index.js";
const ERROR_MESSAGES = {
  default: "Oops, something went wrong.",
  authOnly: "You have to be logged in.",
  rateLimited: "You are sending too many messages. Try again later."
};
const error = writable(void 0);
export {
  ERROR_MESSAGES as E,
  error as e
};
