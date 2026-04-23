function isMessageId(id) {
  return id.split("-").length === 5;
}
function buildSubtree(conv, id) {
  if (!conv.rootMessageId) {
    if (conv.messages.length === 0) return [];
    const index = conv.messages.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Message not found");
    return conv.messages.slice(0, index + 1);
  } else {
    const message = conv.messages.find((m) => m.id === id);
    if (!message) throw new Error("Message not found");
    return [
      ...message.ancestors?.map((ancestorId) => {
        const ancestor = conv.messages.find((m) => m.id === ancestorId);
        if (!ancestor) throw new Error("Ancestor not found");
        return ancestor;
      }) ?? [],
      message
    ];
  }
}
export {
  buildSubtree as b,
  isMessageId as i
};
