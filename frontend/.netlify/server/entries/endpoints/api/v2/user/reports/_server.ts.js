import { s as superjsonResponse } from "../../../../../../chunks/superjsonResponse.js";
import { collections } from "../../../../../../chunks/database.js";
const GET = async ({ locals }) => {
  if (!locals.user || !locals.sessionId) {
    return superjsonResponse([]);
  }
  const reports = await collections.reports.find({
    createdBy: locals.user?._id ?? locals.sessionId
  }).toArray();
  return superjsonResponse(reports);
};
export {
  GET
};
