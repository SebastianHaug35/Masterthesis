import { error } from "@sveltejs/kit";
import { s as superjsonResponse } from "../../../../../../chunks/superjsonResponse.js";
import { r as requireAuth } from "../../../../../../chunks/requireAuth.js";
import { r as resolveConversation } from "../../../../../../chunks/resolveConversation.js";
import { collections } from "../../../../../../chunks/database.js";
import { a as authCondition } from "../../../../../../chunks/auth.js";
import { ObjectId } from "mongodb";
import { v as validModelIdSchema } from "../../../../../../chunks/models.js";
const GET = async ({ locals, params, url }) => {
  requireAuth(locals);
  const conversation = await resolveConversation(
    params.id ?? "",
    locals,
    url.searchParams.get("fromShare")
  );
  return superjsonResponse({
    messages: conversation.messages,
    title: conversation.title,
    model: conversation.model,
    preprompt: conversation.preprompt,
    rootMessageId: conversation.rootMessageId,
    id: conversation._id.toString(),
    updatedAt: conversation.updatedAt,
    modelId: conversation.model,
    shared: conversation.shared
  });
};
const DELETE = async ({ locals, params }) => {
  requireAuth(locals);
  const id = params.id ?? "";
  if (!ObjectId.isValid(id)) {
    error(400, "Invalid conversation ID");
  }
  const res = await collections.conversations.deleteOne({
    _id: new ObjectId(id),
    ...authCondition(locals)
  });
  if (res.deletedCount === 0) {
    error(404, "Conversation not found");
  }
  return superjsonResponse({ success: true });
};
const PATCH = async ({ locals, params, request }) => {
  requireAuth(locals);
  const body = await request.json();
  const title = body?.title;
  const model = body?.model;
  if (title !== void 0) {
    if (typeof title !== "string" || title.length === 0 || title.length > 100) {
      error(400, "Title must be a string between 1 and 100 characters");
    }
  }
  if (model !== void 0) {
    if (!validModelIdSchema.safeParse(model).success) {
      error(400, "Invalid model ID");
    }
  }
  const updateValues = {
    ...title !== void 0 && {
      title: title.replace(/<\/?think>/gi, "").trim()
    },
    ...model !== void 0 && { model }
  };
  const id = params.id ?? "";
  if (!ObjectId.isValid(id)) {
    error(400, "Invalid conversation ID");
  }
  const res = await collections.conversations.updateOne(
    {
      _id: new ObjectId(id),
      ...authCondition(locals)
    },
    { $set: updateValues }
  );
  if (typeof res.matchedCount === "number" ? res.matchedCount === 0 : res.modifiedCount === 0) {
    error(404, "Conversation not found");
  }
  return superjsonResponse({ success: true });
};
export {
  DELETE,
  GET,
  PATCH
};
