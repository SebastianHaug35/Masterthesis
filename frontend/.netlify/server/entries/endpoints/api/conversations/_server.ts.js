import { collections } from "../../../../chunks/database.js";
import { a as authCondition } from "../../../../chunks/auth.js";
import { C as CONV_NUM_PER_PAGE } from "../../../../chunks/pagination.js";
async function GET({ locals, url }) {
  const p = parseInt(url.searchParams.get("p") ?? "0");
  if (locals.user?._id || locals.sessionId) {
    const convs = await collections.conversations.find({
      ...authCondition(locals)
    }).project({
      title: 1,
      updatedAt: 1,
      model: 1
    }).sort({ updatedAt: -1 }).skip(p * CONV_NUM_PER_PAGE).limit(CONV_NUM_PER_PAGE).toArray();
    if (convs.length === 0) {
      return Response.json([]);
    }
    const res = convs.map((conv) => ({
      _id: conv._id,
      id: conv._id,
      // legacy param iOS
      title: conv.title,
      updatedAt: conv.updatedAt,
      model: conv.model,
      modelId: conv.model
      // legacy param iOS
    }));
    return Response.json(res);
  } else {
    return Response.json({ message: "Must have session cookie" }, { status: 401 });
  }
}
async function DELETE({ locals }) {
  if (locals.user?._id || locals.sessionId) {
    await collections.conversations.deleteMany({
      ...authCondition(locals)
    });
  }
  return new Response();
}
export {
  DELETE,
  GET
};
