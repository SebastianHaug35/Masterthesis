import { error } from "@sveltejs/kit";
async function resolveModel(namespace, model) {
  let modelId = namespace;
  if (model) {
    modelId += "/" + model;
  }
  try {
    const { models } = await import("./models.js").then((n) => n.n);
    const found = models.find((m) => m.id === modelId);
    if (!found || found.unlisted) {
      error(404, "Model not found");
    }
    return found;
  } catch (e) {
    if (e && typeof e === "object" && "status" in e) {
      throw e;
    }
    error(500, "Models not available");
  }
}
export {
  resolveModel as r
};
