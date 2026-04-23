import { b as base } from "../../../../../chunks/server.js";
import "../../../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import { redirect } from "@sveltejs/kit";
async function load({ parent, params }) {
  const data = await parent();
  const model = data.models.find((m) => m.id === params.model);
  if (!model || model.unlisted) {
    redirect(302, `${base}/settings`);
  }
  return data;
}
export {
  load
};
