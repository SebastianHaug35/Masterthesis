import { collections } from "../../../../chunks/database.js";
import { z } from "zod";
import { a as authCondition } from "../../../../chunks/auth.js";
import { D as DEFAULT_SETTINGS } from "../../../../chunks/Settings.js";
import { r as resolveStreamingMode } from "../../../../chunks/messageUpdates.js";
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
async function POST({ request, locals }) {
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
    {
      upsert: true
    }
  );
  return new Response();
}
export {
  POST
};
