import { a as adminTokenManager } from "../../../../../chunks/adminToken.js";
import { z } from "zod";
const validateTokenSchema = z.object({
  token: z.string()
});
const POST = async ({ request, locals }) => {
  const { success, data } = validateTokenSchema.safeParse(await request.json());
  if (!success) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
  }
  if (adminTokenManager.checkToken(data.token, locals.sessionId)) {
    return new Response(JSON.stringify({ valid: true }));
  }
  return new Response(JSON.stringify({ valid: false }));
};
export {
  POST
};
