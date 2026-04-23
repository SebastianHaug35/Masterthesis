import { collections } from "../../../chunks/database.js";
import { ObjectId } from "mongodb";
import { redirect, error } from "@sveltejs/kit";
import { b as base } from "../../../chunks/server.js";
import "../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import { z } from "zod";
import { a as validateModel, m as models } from "../../../chunks/models.js";
import { v4 } from "uuid";
import { a as authCondition } from "../../../chunks/auth.js";
import { u as usageLimits } from "../../../chunks/usageLimits.js";
import { M as MetricsServer } from "../../../chunks/metrics.js";
const POST = async ({ locals, request }) => {
  const body = await request.text();
  let title = "";
  const parsedBody = z.object({
    fromShare: z.string().optional(),
    model: validateModel(models),
    preprompt: z.string().optional()
  }).safeParse(JSON.parse(body));
  if (!parsedBody.success) {
    error(400, "Invalid request");
  }
  const values = parsedBody.data;
  const convCount = await collections.conversations.countDocuments(authCondition(locals));
  if (usageLimits?.conversations && convCount > usageLimits?.conversations) {
    error(429, "You have reached the maximum number of conversations. Delete some to continue.");
  }
  const model = models.find((m) => (m.id || m.name) === values.model);
  if (!model) {
    error(400, "Invalid model");
  }
  let messages = [
    {
      id: v4(),
      from: "system",
      content: values.preprompt ?? "",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      children: [],
      ancestors: []
    }
  ];
  let rootMessageId = messages[0].id;
  if (values.fromShare) {
    const conversation = await collections.sharedConversations.findOne({
      _id: values.fromShare
    });
    if (!conversation) {
      error(404, "Conversation not found");
    }
    title = conversation.title.replace(/<\/?think>/gi, "").trim();
    messages = conversation.messages;
    rootMessageId = conversation.rootMessageId ?? rootMessageId;
    values.model = conversation.model;
    values.preprompt = conversation.preprompt;
  }
  if (model.unlisted) {
    error(400, "Can't start a conversation with an unlisted model");
  }
  values.preprompt ??= model?.preprompt ?? "";
  if (messages && messages.length > 0 && messages[0].from === "system") {
    messages[0].content = values.preprompt;
  }
  const res = await collections.conversations.insertOne({
    _id: new ObjectId(),
    // Always store sanitized titles
    title: (title || "New Chat").replace(/<\/?think>/gi, "").trim(),
    rootMessageId,
    messages,
    model: values.model,
    preprompt: values.preprompt,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    userAgent: request.headers.get("User-Agent") ?? void 0,
    ...locals.user ? { userId: locals.user._id } : { sessionId: locals.sessionId },
    ...values.fromShare ? { meta: { fromShareId: values.fromShare } } : {}
  });
  if (MetricsServer.isEnabled()) {
    MetricsServer.getMetrics().model.conversationsTotal.inc({ model: values.model });
  }
  return new Response(
    JSON.stringify({
      conversationId: res.insertedId.toString()
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
const GET = async () => {
  redirect(302, `${base}/`);
};
export {
  GET,
  POST
};
