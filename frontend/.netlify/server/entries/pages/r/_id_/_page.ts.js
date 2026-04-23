import { redirect } from "@sveltejs/kit";
import { u as useAPIClient, h as handleResponse } from "../../../../chunks/APIClient.js";
import { b as base } from "../../../../chunks/server.js";
import "../../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
const load = async ({ params, url, fetch, parent }) => {
  const leafId = url.searchParams.get("leafId");
  const parentData = await parent();
  if (parentData.loginEnabled && parentData.user && params.id) {
    const client = useAPIClient({ fetch, origin: url.origin });
    let importedConversationId;
    try {
      const result = await client.conversations["import-share"].post({ shareId: params.id }).then(handleResponse);
      importedConversationId = result.conversationId;
    } catch {
    }
    if (importedConversationId) {
      redirect(
        302,
        `${base}/conversation/${importedConversationId}?leafId=${leafId ?? ""}&fromShare=${params.id}`
      );
    }
  }
  redirect(302, `${base}/conversation/${params.id}${leafId ? `?leafId=${leafId}` : ""}`);
};
export {
  load
};
