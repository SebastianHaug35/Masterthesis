import { b as base } from "./server.js";
import "./url.js";
import "@sveltejs/kit/internal/server";
import "./root.js";
import superjson from "superjson";
import ObjectId from "bson-objectid";
superjson.registerCustom(
  {
    isApplicable: (value) => {
      if (typeof value !== "string" && ObjectId.isValid(value)) {
        const str = value.toString();
        return /^[0-9a-fA-F]{24}$/.test(str);
      }
      return false;
    },
    serialize: (value) => value.toString(),
    deserialize: (value) => new ObjectId(value)
  },
  "ObjectId"
);
async function apiCall(fetcher, url, method, body, query) {
  const u = new URL(url);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== void 0 && v !== null) {
        u.searchParams.set(k, String(v));
      }
    }
  }
  const init = { method };
  if (body !== void 0 && body !== null) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  const res = await fetcher(u.toString(), init);
  if (!res.ok) {
    let errorBody;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text().catch(() => res.statusText);
    }
    return { data: null, error: errorBody, status: res.status };
  }
  const text = await res.text();
  if (!text) {
    return { data: null, error: null, status: res.status };
  }
  return { data: text, error: null, status: res.status };
}
function endpoint(fetcher, baseUrl) {
  return {
    get(opts) {
      return apiCall(fetcher, baseUrl, "GET", void 0, opts?.query);
    },
    post(body) {
      return apiCall(fetcher, baseUrl, "POST", body);
    },
    patch(body) {
      return apiCall(fetcher, baseUrl, "PATCH", body);
    },
    delete() {
      return apiCall(fetcher, baseUrl, "DELETE");
    }
  };
}
function useAPIClient({
  fetch: customFetch,
  origin
} = {}) {
  const fetcher = customFetch ?? globalThis.fetch;
  const baseUrl = `${origin ?? `http://localhost:5173`}${base}/api/v2`;
  return {
    conversations: Object.assign(
      // client.conversations({ id: "..." }) — returns endpoint for /conversations/:id
      (params) => ({
        ...endpoint(fetcher, `${baseUrl}/conversations/${params.id}`),
        message: (msgParams) => endpoint(fetcher, `${baseUrl}/conversations/${params.id}/message/${msgParams.messageId}`)
      }),
      // client.conversations.get(), .delete()
      {
        ...endpoint(fetcher, `${baseUrl}/conversations`),
        "import-share": endpoint(fetcher, `${baseUrl}/conversations/import-share`)
      }
    ),
    user: {
      ...endpoint(fetcher, `${baseUrl}/user`),
      settings: endpoint(fetcher, `${baseUrl}/user/settings`),
      reports: endpoint(fetcher, `${baseUrl}/user/reports`),
      "billing-orgs": endpoint(fetcher, `${baseUrl}/user/billing-orgs`)
    },
    models: {
      ...endpoint(fetcher, `${baseUrl}/models`),
      old: endpoint(fetcher, `${baseUrl}/models/old`),
      refresh: endpoint(fetcher, `${baseUrl}/models/refresh`)
    },
    "public-config": endpoint(fetcher, `${baseUrl}/public-config`),
    "feature-flags": endpoint(fetcher, `${baseUrl}/feature-flags`),
    debug: {
      config: endpoint(fetcher, `${baseUrl}/debug/config`),
      refresh: endpoint(fetcher, `${baseUrl}/debug/refresh`)
    },
    export: endpoint(fetcher, `${baseUrl}/export`)
  };
}
function handleResponse(response) {
  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }
  if (response.data === null) {
    return null;
  }
  return superjson.parse(
    typeof response.data === "string" ? response.data : JSON.stringify(response.data)
  );
}
export {
  handleResponse as h,
  useAPIClient as u
};
