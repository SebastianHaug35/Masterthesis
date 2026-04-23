import { c as config } from "../../../../chunks/config.js";
import { collections } from "../../../../chunks/database.js";
import { error } from "@sveltejs/kit";
import { pathToFileURL } from "node:url";
import { unlink } from "node:fs/promises";
import { uploadFile } from "@huggingface/hub";
import parquet from "parquetjs";
import { z } from "zod";
import { l as logger } from "../../../../chunks/logger.js";
async function POST({ request }) {
  if (!config.PARQUET_EXPORT_DATASET || !config.PARQUET_EXPORT_HF_TOKEN) {
    error(500, "Parquet export is not configured.");
  }
  const { model } = z.object({
    model: z.string()
  }).parse(await request.json());
  const schema = new parquet.ParquetSchema({
    title: { type: "UTF8" },
    created_at: { type: "TIMESTAMP_MILLIS" },
    updated_at: { type: "TIMESTAMP_MILLIS" },
    messages: {
      repeated: true,
      fields: {
        from: { type: "UTF8" },
        content: { type: "UTF8" },
        score: { type: "INT_8", optional: true }
      }
    }
  });
  const fileName = `/tmp/conversations-${(/* @__PURE__ */ new Date()).toJSON().slice(0, 10)}-${Date.now()}.parquet`;
  const writer = await parquet.ParquetWriter.openFile(schema, fileName);
  let count = 0;
  logger.info("Exporting conversations for model", model);
  for await (const conversation of collections.settings.aggregate([
    {
      $match: {
        shareConversationsWithModelAuthors: true,
        sessionId: { $exists: true },
        userId: { $exists: false }
      }
    },
    {
      $lookup: {
        from: "conversations",
        localField: "sessionId",
        foreignField: "sessionId",
        as: "conversations",
        pipeline: [{ $match: { model, userId: { $exists: false } } }]
      }
    },
    { $unwind: "$conversations" },
    {
      $project: {
        title: "$conversations.title",
        created_at: "$conversations.createdAt",
        updated_at: "$conversations.updatedAt",
        messages: "$conversations.messages"
      }
    }
  ])) {
    await writer.appendRow({
      title: conversation.title,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      messages: conversation.messages.map((message) => ({
        from: message.from,
        content: message.content,
        ...message.score ? { score: message.score } : void 0
      }))
    });
    ++count;
    if (count % 1e3 === 0) {
      logger.info("Exported", count, "conversations");
    }
  }
  logger.info("exporting convos with userId");
  for await (const conversation of collections.settings.aggregate([
    { $match: { shareConversationsWithModelAuthors: true, userId: { $exists: true } } },
    {
      $lookup: {
        from: "conversations",
        localField: "userId",
        foreignField: "userId",
        as: "conversations",
        pipeline: [{ $match: { model } }]
      }
    },
    { $unwind: "$conversations" },
    {
      $project: {
        title: "$conversations.title",
        created_at: "$conversations.createdAt",
        updated_at: "$conversations.updatedAt",
        messages: "$conversations.messages"
      }
    }
  ])) {
    await writer.appendRow({
      title: conversation.title,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      messages: conversation.messages.map((message) => ({
        from: message.from,
        content: message.content,
        ...message.score ? { score: message.score } : void 0
      }))
    });
    ++count;
    if (count % 1e3 === 0) {
      logger.info("Exported", count, "conversations");
    }
  }
  await writer.close();
  logger.info("Uploading", fileName, "to Hugging Face Hub");
  await uploadFile({
    file: pathToFileURL(fileName),
    credentials: { accessToken: config.PARQUET_EXPORT_HF_TOKEN },
    repo: {
      type: "dataset",
      name: config.PARQUET_EXPORT_DATASET
    }
  });
  logger.info("Upload done");
  await unlink(fileName);
  return new Response();
}
export {
  POST
};
