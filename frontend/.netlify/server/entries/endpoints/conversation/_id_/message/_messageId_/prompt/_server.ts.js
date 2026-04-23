import { m as models, k as buildPrompt } from "../../../../../../../chunks/models.js";
import { a as authCondition } from "../../../../../../../chunks/auth.js";
import { collections } from "../../../../../../../chunks/database.js";
import { i as isMessageId, b as buildSubtree } from "../../../../../../../chunks/buildSubtree.js";
import { error } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
async function GET({ params, locals }) {
  const conv = params.id.length === 7 ? await collections.sharedConversations.findOne({
    _id: params.id
  }) : await collections.conversations.findOne({
    _id: new ObjectId(params.id),
    ...authCondition(locals)
  });
  if (conv === null) {
    error(404, "Conversation not found");
  }
  const messageId = params.messageId;
  const messageIndex = conv.messages.findIndex((msg) => msg.id === messageId);
  if (!isMessageId(messageId) || messageIndex === -1) {
    error(404, "Message not found");
  }
  const model = models.find((m) => m.id === conv.model);
  if (!model) {
    error(404, "Conversation model not found");
  }
  const messagesUpTo = buildSubtree(conv, messageId);
  const prompt = await buildPrompt({
    preprompt: conv.preprompt,
    messages: messagesUpTo,
    model
  }).catch((err) => {
    console.error(err);
    return "Prompt generation failed";
  });
  return Response.json({
    prompt,
    model: model.name,
    parameters: {
      ...model.parameters,
      return_full_text: false
    },
    messages: messagesUpTo.map((msg) => ({
      role: msg.from,
      content: msg.content,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      updates: msg.updates?.filter((u) => u.type === "title"),
      files: msg.files
    }))
  });
}
export {
  GET
};
