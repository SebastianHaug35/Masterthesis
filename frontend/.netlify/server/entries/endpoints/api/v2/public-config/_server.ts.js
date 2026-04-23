import { s as superjsonResponse } from "../../../../../chunks/superjsonResponse.js";
import { c as config } from "../../../../../chunks/config.js";
const GET = async () => {
  return superjsonResponse(await config.getPublicConfig());
};
export {
  GET
};
