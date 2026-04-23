import { collections } from "./database.js";
import { ObjectId } from "mongodb";
import { a as authCondition } from "./auth.js";
import { c as convertLegacyConversation } from "./convertLegacyConversation.js";
import { error } from "@sveltejs/kit";
async function resolveConversation(id, locals, fromShare) {
  let conversation;
  let shared = false;
  if (id.length === 7) {
    conversation = await collections.sharedConversations.findOne({
      _id: id
    });
    shared = true;
    if (!conversation) {
      error(404, "Conversation not found");
    }
  } else {
    try {
      new ObjectId(id);
    } catch {
      error(400, "Invalid conversation ID format");
    }
    conversation = await collections.conversations.findOne({
      _id: new ObjectId(id),
      ...authCondition(locals)
    });
    if (!conversation) {
      const conversationExists = await collections.conversations.countDocuments({
        _id: new ObjectId(id)
      }) !== 0;
      if (conversationExists) {
        error(
          403,
          "You don't have access to this conversation. If someone gave you this link, ask them to use the 'share' feature instead."
        );
      }
      error(404, "Conversation not found.");
    }
    if (fromShare && conversation.meta?.fromShareId === fromShare) {
      shared = true;
    }
  }
  return {
    ...conversation,
    ...convertLegacyConversation(conversation),
    shared
  };
}
export {
  resolveConversation as r
};
