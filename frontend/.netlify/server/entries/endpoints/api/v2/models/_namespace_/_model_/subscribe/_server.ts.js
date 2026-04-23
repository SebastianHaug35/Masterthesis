import { error } from "@sveltejs/kit";
import { r as resolveModel } from "../../../../../../../../chunks/resolveModel.js";
import { collections } from "../../../../../../../../chunks/database.js";
import { a as authCondition } from "../../../../../../../../chunks/auth.js";
const POST = async ({ params, locals }) => {
  if (!locals.sessionId) {
    error(401, "Unauthorized");
  }
  const model = await resolveModel(params.namespace ?? "", params.model ?? "");
  await collections.settings.updateOne(
    authCondition(locals),
    {
      $set: {
        activeModel: model.id,
        updatedAt: /* @__PURE__ */ new Date()
      },
      $setOnInsert: {
        createdAt: /* @__PURE__ */ new Date()
      }
    },
    { upsert: true }
  );
  return new Response();
};
export {
  POST
};
