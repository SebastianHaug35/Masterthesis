import { s as superjsonResponse } from "../../../../../chunks/superjsonResponse.js";
const GET = async () => {
  try {
    const { models } = await import("../../../../../chunks/models.js").then((n) => n.n);
    return superjsonResponse(
      models.filter((m) => m.unlisted == false).map((model) => ({
        id: model.id,
        name: model.name,
        websiteUrl: model.websiteUrl,
        modelUrl: model.modelUrl,
        datasetName: model.datasetName,
        datasetUrl: model.datasetUrl,
        displayName: model.displayName,
        description: model.description,
        logoUrl: model.logoUrl,
        providers: model.providers,
        promptExamples: model.promptExamples,
        parameters: model.parameters,
        preprompt: model.preprompt,
        multimodal: model.multimodal,
        multimodalAcceptedMimetypes: model.multimodalAcceptedMimetypes,
        supportsTools: model.supportsTools ?? false,
        unlisted: model.unlisted,
        hasInferenceAPI: model.hasInferenceAPI,
        isRouter: model.isRouter
      }))
    );
  } catch {
    return superjsonResponse([]);
  }
};
export {
  GET
};
