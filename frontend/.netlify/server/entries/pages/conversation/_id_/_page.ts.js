import { u as useAPIClient, h as handleResponse } from "../../../../chunks/APIClient.js";
import { U as UrlDependency } from "../../../../chunks/UrlDependency.js";
import { redirect } from "@sveltejs/kit";
import { b as base } from "../../../../chunks/server.js";
import "../../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
const load = async ({ params, depends, fetch, url, parent }) => {
  depends(UrlDependency.Conversation);
  const client = useAPIClient({ fetch, origin: url.origin });
  if (params.id.length === 7) {
    const parentData = await parent();
    if (parentData.loginEnabled && parentData.user) {
      const leafId = url.searchParams.get("leafId");
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
  }
  try {
    return await client.conversations({ id: params.id }).get({ query: { fromShare: url.searchParams.get("fromShare") ?? void 0 } }).then(handleResponse);
  } catch {
    redirect(302, `${base}/`);
  }
};
export {
  load
};
