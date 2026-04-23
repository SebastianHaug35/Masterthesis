import { v4 } from "uuid";
function convertLegacyConversation(conv) {
  if (conv.rootMessageId) return conv;
  if (conv.messages.length === 0) return conv;
  const messages = [
    {
      from: "system",
      content: conv.preprompt ?? "",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      id: v4()
    },
    ...conv.messages
  ];
  const rootMessageId = messages[0].id;
  const newMessages = messages.map((message, index) => {
    return {
      ...message,
      ancestors: messages.slice(0, index).map((m) => m.id),
      children: index < messages.length - 1 ? [messages[index + 1].id] : []
    };
  });
  return {
    ...conv,
    rootMessageId,
    messages: newMessages
  };
}
export {
  convertLegacyConversation as c
};
