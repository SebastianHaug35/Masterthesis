import { s as superjsonResponse } from "../../../../../chunks/superjsonResponse.js";
import { r as requireAuth } from "../../../../../chunks/requireAuth.js";
import { collections } from "../../../../../chunks/database.js";
import { a as authCondition } from "../../../../../chunks/auth.js";
import { C as CONV_NUM_PER_PAGE } from "../../../../../chunks/pagination.js";
const GET = async ({ locals, url }) => {
  requireAuth(locals);
  const pageSize = CONV_NUM_PER_PAGE;
  const p = parseInt(url.searchParams.get("p") ?? "0") || 0;
  const convs = await collections.conversations.find(authCondition(locals)).project({
    title: 1,
    updatedAt: 1,
    model: 1
  }).sort({ updatedAt: -1 }).skip(p * pageSize).limit(pageSize + 1).toArray();
  const hasMore = convs.length > pageSize;
  const res = (hasMore ? convs.slice(0, pageSize) : convs).map((conv) => ({
    _id: conv._id,
    id: conv._id,
    // legacy param iOS
    title: conv.title,
    updatedAt: conv.updatedAt,
    model: conv.model,
    modelId: conv.model
    // legacy param iOS
  }));
  return superjsonResponse({ conversations: res, hasMore });
};
const DELETE = async ({ locals }) => {
  requireAuth(locals);
  const res = await collections.conversations.deleteMany({
    ...authCondition(locals)
  });
  return superjsonResponse(res.deletedCount);
};
export {
  DELETE,
  GET
};
