import { s as superjsonResponse } from "../../../../../../chunks/superjsonResponse.js";
import { collections } from "../../../../../../chunks/database.js";
import { a as authCondition } from "../../../../../../chunks/auth.js";
import { r as requireAuth } from "../../../../../../chunks/requireAuth.js";
import { a as validateModel, d as defaultModel, m as models } from "../../../../../../chunks/models.js";
import { D as DEFAULT_SETTINGS } from "../../../../../../chunks/Settings.js";
import { r as resolveStreamingMode } from "../../../../../../chunks/messageUpdates.js";
import { z } from "zod";
const settingsSchema = z.object({
  shareConversationsWithModelAuthors: z.boolean().default(DEFAULT_SETTINGS.shareConversationsWithModelAuthors),
  welcomeModalSeen: z.boolean().optional(),
  activeModel: z.string().default(DEFAULT_SETTINGS.activeModel),
  customPrompts: z.record(z.string()).default({}),
  customPromptsEnabled: z.record(z.boolean()).default({}),
  multimodalOverrides: z.record(z.boolean()).default({}),
  toolsOverrides: z.record(z.boolean()).default({}),
  providerOverrides: z.record(z.string()).default({}),
  streamingMode: z.enum(["raw", "smooth"]).optional(),
  directPaste: z.boolean().default(false),
  hapticsEnabled: z.boolean().default(true),
  hidePromptExamples: z.record(z.boolean()).default({}),
  billingOrganization: z.string().optional()
});
const GET = async ({ locals }) => {
  requireAuth(locals);
  const settings = await collections.settings.findOne(authCondition(locals));
  if (settings && !validateModel(models).safeParse(settings?.activeModel).success) {
    settings.activeModel = defaultModel.id;
    await collections.settings.updateOne(authCondition(locals), {
      $set: { activeModel: defaultModel.id }
    });
  }
  if (settings?.activeModel && models.find((m) => m.id === settings?.activeModel)?.unlisted === true) {
    settings.activeModel = defaultModel.id;
    await collections.settings.updateOne(authCondition(locals), {
      $set: { activeModel: defaultModel.id }
    });
  }
  const streamingMode = resolveStreamingMode(settings ?? {});
  return superjsonResponse({
    welcomeModalSeen: !!settings?.welcomeModalSeenAt,
    welcomeModalSeenAt: settings?.welcomeModalSeenAt ?? null,
    activeModel: settings?.activeModel ?? DEFAULT_SETTINGS.activeModel,
    streamingMode,
    directPaste: settings?.directPaste ?? DEFAULT_SETTINGS.directPaste,
    hapticsEnabled: settings?.hapticsEnabled ?? DEFAULT_SETTINGS.hapticsEnabled,
    hidePromptExamples: settings?.hidePromptExamples ?? DEFAULT_SETTINGS.hidePromptExamples,
    shareConversationsWithModelAuthors: settings?.shareConversationsWithModelAuthors ?? DEFAULT_SETTINGS.shareConversationsWithModelAuthors,
    customPrompts: settings?.customPrompts ?? {},
    customPromptsEnabled: settings?.customPromptsEnabled ?? {},
    multimodalOverrides: settings?.multimodalOverrides ?? {},
    toolsOverrides: settings?.toolsOverrides ?? {},
    providerOverrides: settings?.providerOverrides ?? {},
    billingOrganization: settings?.billingOrganization ?? void 0
  });
};
const POST = async ({ locals, request }) => {
  requireAuth(locals);
  const body = await request.json();
  const { welcomeModalSeen, ...parsedSettings } = settingsSchema.parse(body);
  const streamingMode = resolveStreamingMode(parsedSettings);
  const settings = {
    ...parsedSettings,
    streamingMode
  };
  await collections.settings.updateOne(
    authCondition(locals),
    {
      $set: {
        ...settings,
        ...welcomeModalSeen && { welcomeModalSeenAt: /* @__PURE__ */ new Date() },
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
  GET,
  POST
};
