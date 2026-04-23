import { error } from "@sveltejs/kit";
import { s as superjsonResponse } from "../../../../../../../../chunks/superjsonResponse.js";
import { r as requireAuth } from "../../../../../../../../chunks/requireAuth.js";
import { r as resolveConversation } from "../../../../../../../../chunks/resolveConversation.js";
import { collections } from "../../../../../../../../chunks/database.js";
import { a as authCondition } from "../../../../../../../../chunks/auth.js";
import { ObjectId } from "mongodb";
const DELETE = async ({ locals, params }) => {
  requireAuth(locals);
  const id = params.id ?? "";
  const messageId = params.messageId ?? "";
  const conversation = await resolveConversation(id, locals);
  if (!conversation.messages.map((m) => m.id).includes(messageId)) {
    error(404, "Message not found");
  }
  const filteredMessages = conversation.messages.filter(
    (message) => !(message.id === messageId) && message.ancestors && !message.ancestors.includes(messageId)
  ).map((message) => {
    if (message.children && message.children.includes(messageId)) {
      message.children = message.children.filter((child) => child !== messageId);
    }
    return message;
  });
  const res = await collections.conversations.updateOne(
    { _id: new ObjectId(conversation._id), ...authCondition(locals) },
    { $set: { messages: filteredMessages } }
  );
  if (res.modifiedCount === 0) {
    error(500, "Deleting message failed");
  }
  return superjsonResponse({ success: true });
};
export {
  DELETE
};
