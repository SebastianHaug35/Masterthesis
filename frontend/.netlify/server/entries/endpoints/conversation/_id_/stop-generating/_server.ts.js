import { a as authCondition } from "../../../../../chunks/auth.js";
import { collections } from "../../../../../chunks/database.js";
import { A as AbortRegistry } from "../../../../../chunks/abortRegistry.js";
import { error } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
async function POST({ params, locals }) {
  if (!locals.user && !locals.sessionId) {
    error(401, "Unauthorized");
  }
  const conversationId = new ObjectId(params.id);
  const conversation = await collections.conversations.findOne({
    _id: conversationId,
    ...authCondition(locals)
  });
  if (!conversation) {
    error(404, "Conversation not found");
  }
  AbortRegistry.getInstance().abort(conversationId.toString());
  await collections.abortedGenerations.updateOne(
    { conversationId },
    { $set: { updatedAt: /* @__PURE__ */ new Date() }, $setOnInsert: { createdAt: /* @__PURE__ */ new Date() } },
    { upsert: true }
  );
  return new Response();
}
export {
  POST
};
