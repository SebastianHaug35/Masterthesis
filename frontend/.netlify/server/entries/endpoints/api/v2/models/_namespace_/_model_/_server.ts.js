import { s as superjsonResponse } from "../../../../../../../chunks/superjsonResponse.js";
import { r as resolveModel } from "../../../../../../../chunks/resolveModel.js";
const GET = async ({ params }) => {
  const model = await resolveModel(params.namespace ?? "", params.model ?? "");
  return superjsonResponse(model);
};
export {
  GET
};
