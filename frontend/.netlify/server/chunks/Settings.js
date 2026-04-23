import { d as defaultModel } from "./models.js";
const DEFAULT_SETTINGS = {
  shareConversationsWithModelAuthors: true,
  activeModel: defaultModel.id,
  customPrompts: {},
  customPromptsEnabled: {},
  multimodalOverrides: {},
  toolsOverrides: {},
  hidePromptExamples: {},
  providerOverrides: {},
  streamingMode: "smooth",
  directPaste: false,
  hapticsEnabled: true
};
export {
  DEFAULT_SETTINGS as D
};
