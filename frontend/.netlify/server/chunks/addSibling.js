import { v4 } from "uuid";
function addChildren(conv, message, parentId) {
  if (conv.messages.length === 0) {
    const messageId2 = v4();
    conv.rootMessageId = messageId2;
    conv.messages.push({
      ...message,
      ancestors: [],
      id: messageId2
    });
    return messageId2;
  }
  if (!parentId) {
    throw new Error("You need to specify a parentId if this is not the first message");
  }
  const messageId = v4();
  if (!conv.rootMessageId) {
    if (!!parentId && parentId !== conv.messages[conv.messages.length - 1].id) {
      throw new Error("This is a legacy conversation, you can only append to the last message");
    }
    conv.messages.push({ ...message, id: messageId });
    return messageId;
  }
  const ancestors = [...conv.messages.find((m) => m.id === parentId)?.ancestors ?? [], parentId];
  conv.messages.push({
    ...message,
    ancestors,
    id: messageId,
    children: []
  });
  const parent = conv.messages.find((m) => m.id === parentId);
  if (parent) {
    if (parent.children) {
      parent.children.push(messageId);
    } else parent.children = [messageId];
  }
  return messageId;
}
function addSibling(conv, message, siblingId) {
  if (conv.messages.length === 0) {
    throw new Error("Cannot add a sibling to an empty conversation");
  }
  if (!conv.rootMessageId) {
    throw new Error("Cannot add a sibling to a legacy conversation");
  }
  const sibling = conv.messages.find((m) => m.id === siblingId);
  if (!sibling) {
    throw new Error("The sibling message doesn't exist");
  }
  if (!sibling.ancestors || sibling.ancestors?.length === 0) {
    throw new Error("The sibling message is the root message, therefore we can't add a sibling");
  }
  const messageId = v4();
  conv.messages.push({
    ...message,
    id: messageId,
    ancestors: sibling.ancestors,
    children: []
  });
  const nearestAncestorId = sibling.ancestors[sibling.ancestors.length - 1];
  const nearestAncestor = conv.messages.find((m) => m.id === nearestAncestorId);
  if (nearestAncestor) {
    if (nearestAncestor.children) {
      nearestAncestor.children.push(messageId);
    } else nearestAncestor.children = [messageId];
  }
  return messageId;
}
export {
  addSibling as a,
  addChildren as b
};
