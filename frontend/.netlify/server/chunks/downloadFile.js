import { error } from "@sveltejs/kit";
import { collections } from "./database.js";
async function downloadFile(sha256, convId) {
  const fileId = collections.bucket.find({ filename: `${convId.toString()}-${sha256}` });
  const file = await fileId.next();
  if (!file) {
    error(404, "File not found");
  }
  if (file.metadata?.conversation !== convId.toString()) {
    error(403, "You don't have access to this file.");
  }
  const mime = file.metadata?.mime;
  const name = file.filename;
  const fileStream = collections.bucket.openDownloadStream(file._id);
  const buffer = await new Promise((resolve, reject) => {
    const chunks = [];
    fileStream.on("data", (chunk) => chunks.push(chunk));
    fileStream.on("error", reject);
    fileStream.on("end", () => resolve(Buffer.concat(chunks)));
  });
  return { type: "base64", name, value: buffer.toString("base64"), mime };
}
export {
  downloadFile as d
};
