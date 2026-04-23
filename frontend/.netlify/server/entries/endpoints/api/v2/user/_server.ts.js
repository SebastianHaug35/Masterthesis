import { s as superjsonResponse } from "../../../../../chunks/superjsonResponse.js";
const GET = async ({ locals }) => {
  return superjsonResponse(
    locals.user ? {
      id: locals.user._id.toString(),
      username: locals.user.username,
      avatarUrl: locals.user.avatarUrl,
      email: locals.user.email,
      isAdmin: locals.user.isAdmin ?? false,
      isEarlyAccess: locals.user.isEarlyAccess ?? false
    } : null
  );
};
export {
  GET
};
