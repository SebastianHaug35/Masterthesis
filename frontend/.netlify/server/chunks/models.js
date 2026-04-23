import { b as building } from "./environment.js";
import { c as config } from "./config.js";
import { z } from "zod";
import sharp from "sharp";
import { T as TEXT_MIME_ALLOWLIST } from "./mime.js";
import JSON5 from "json5";
import { l as logger } from "./logger.js";
import { readFile } from "node:fs/promises";
import { g as getApiToken } from "./apiToken.js";
async function* openAICompletionToTextGenerationStream(completionStream) {
  let generatedText = "";
  let tokenId = 0;
  for await (const completion of completionStream) {
    const { choices } = completion;
    const text = choices?.[0]?.text ?? "";
    const last = choices?.[0]?.finish_reason === "stop" || choices?.[0]?.finish_reason === "length";
    if (text) {
      generatedText = generatedText + text;
    }
    const output = {
      token: {
        id: tokenId++,
        text,
        logprob: 0,
        special: last
      },
      generated_text: last ? generatedText : null,
      details: null
    };
    yield output;
  }
}
async function* openAIChatToTextGenerationStream(completionStream, getRouterMetadata) {
  let generatedText = "";
  let tokenId = 0;
  let toolBuffer = "";
  let metadataYielded = false;
  let thinkOpen = false;
  for await (const completion of completionStream) {
    const retyped = completion;
    if (!metadataYielded && retyped["x-router-metadata"]) {
      const metadata = retyped["x-router-metadata"];
      yield {
        token: {
          id: tokenId++,
          text: "",
          logprob: 0,
          special: true
        },
        generated_text: null,
        details: null,
        routerMetadata: {
          route: metadata.route,
          model: metadata.model,
          provider: metadata.provider
        }
      };
      metadataYielded = true;
      if (!completion.choices || completion.choices.length === 0 || !completion.choices[0].delta?.content) {
        continue;
      }
    }
    const { choices } = completion;
    const delta = choices?.[0]?.delta ?? {};
    const content = delta.content ?? "";
    const reasoning = typeof delta?.reasoning === "string" ? delta.reasoning : typeof delta?.reasoning_content === "string" ? delta.reasoning_content : "";
    const last = choices?.[0]?.finish_reason === "stop" || choices?.[0]?.finish_reason === "length";
    if (choices?.[0]?.finish_reason === "stop" && toolBuffer.length > 0) {
      yield {
        token: {
          id: tokenId++,
          special: true,
          logprob: 0,
          text: ""
        },
        generated_text: toolBuffer,
        details: null
      };
      break;
    }
    if (choices?.[0]?.delta?.tool_calls) {
      const calls = Array.isArray(choices[0].delta.tool_calls) ? choices[0].delta.tool_calls : [choices[0].delta.tool_calls];
      if (calls.length === 1 && calls[0].index === 0 && calls[0].id === "" && calls[0].type === "function" && !!calls[0].function && calls[0].function.name === null) {
        toolBuffer += calls[0].function.arguments;
        continue;
      }
    }
    let combined = "";
    if (reasoning && reasoning.length > 0) {
      if (!thinkOpen) {
        combined += "<think>" + reasoning;
        thinkOpen = true;
      } else {
        combined += reasoning;
      }
    }
    if (content && content.length > 0) {
      const trimmed = content.trim();
      if (thinkOpen && trimmed === "</think>") {
        combined += "</think>";
        thinkOpen = false;
      } else if (thinkOpen) {
        combined += "</think>" + content;
        thinkOpen = false;
      } else {
        combined += content;
      }
    }
    generatedText += combined;
    const output = {
      token: {
        id: tokenId++,
        text: combined,
        logprob: 0,
        special: last
      },
      generated_text: last ? generatedText : null,
      details: null
    };
    yield output;
  }
  if (!metadataYielded && getRouterMetadata) {
    const routerMetadata = getRouterMetadata();
    if (routerMetadata && routerMetadata.route && routerMetadata.model || routerMetadata?.provider) {
      yield {
        token: {
          id: tokenId++,
          text: "",
          logprob: 0,
          special: true
        },
        generated_text: null,
        details: null,
        routerMetadata
      };
    }
  }
}
async function* openAIChatToTextGenerationSingle(completion, getRouterMetadata) {
  const message = completion.choices?.[0]?.message ?? {};
  let content = message?.content || "";
  const r = typeof message?.reasoning === "string" ? message.reasoning : typeof message?.reasoning_content === "string" ? message.reasoning_content : "";
  if (r && r.length > 0) {
    content = `<think>${r}</think>` + content;
  }
  const tokenId = 0;
  yield {
    token: {
      id: tokenId,
      text: content,
      logprob: 0,
      special: false
    },
    generated_text: content,
    details: null,
    ...getRouterMetadata ? (() => {
      const metadata = getRouterMetadata();
      return metadata && metadata.route && metadata.model || metadata?.provider ? { routerMetadata: metadata } : {};
    })() : {}
  };
}
async function buildPrompt({
  messages,
  model,
  preprompt
}) {
  const filteredMessages = messages;
  if (filteredMessages[0].from === "system" && preprompt) {
    filteredMessages[0].content = preprompt;
  }
  const prompt = model.chatPromptRender({
    messages: filteredMessages.map((m) => ({
      ...m,
      role: m.from
    })),
    preprompt
  }).split(" ").slice(-(model.parameters?.truncate ?? 0)).join(" ");
  return prompt;
}
function createImageProcessorOptionsValidator(defaults) {
  return z.object({
    supportedMimeTypes: z.array(
      z.enum([
        defaults.supportedMimeTypes[0],
        ...defaults.supportedMimeTypes.slice(1)
      ])
    ).default(defaults.supportedMimeTypes),
    preferredMimeType: z.enum([defaults.supportedMimeTypes[0], ...defaults.supportedMimeTypes.slice(1)]).default(defaults.preferredMimeType),
    maxSizeInMB: z.number().positive().default(defaults.maxSizeInMB),
    maxWidth: z.number().int().positive().default(defaults.maxWidth),
    maxHeight: z.number().int().positive().default(defaults.maxHeight)
  }).default(defaults);
}
function makeImageProcessor(options) {
  return async (file) => {
    const { supportedMimeTypes, preferredMimeType, maxSizeInMB, maxWidth, maxHeight } = options;
    const { mime, value } = file;
    const buffer = Buffer.from(value, "base64");
    let sharpInst = sharp(buffer);
    const metadata = await sharpInst.metadata();
    if (!metadata) throw Error("Failed to read image metadata");
    const { width, height } = metadata;
    if (width === void 0 || height === void 0) throw Error("Failed to read image size");
    const tooLargeInSize = width > maxWidth || height > maxHeight;
    const tooLargeInBytes = buffer.byteLength > maxSizeInMB * 1e3 * 1e3;
    const outputMime = chooseMimeType(supportedMimeTypes, preferredMimeType, mime, {
      preferSizeReduction: tooLargeInBytes
    });
    if (tooLargeInSize || tooLargeInBytes) {
      const size = chooseImageSize({
        mime: outputMime,
        width,
        height,
        maxWidth,
        maxHeight,
        maxSizeInMB
      });
      if (size.width !== width || size.height !== height) {
        sharpInst = resizeImage(sharpInst, size.width, size.height);
      }
    }
    if (outputMime !== mime || tooLargeInBytes) {
      sharpInst = convertImage(sharpInst, outputMime);
    }
    const processedImage = await sharpInst.toBuffer();
    return { image: processedImage, mime: outputMime };
  };
}
const outputFormats = ["png", "jpeg", "webp", "avif", "tiff", "gif"];
const isOutputFormat = (format) => outputFormats.includes(format);
function convertImage(sharpInst, outputMime) {
  const [type, format] = outputMime.split("/");
  if (type !== "image") throw Error(`Requested non-image mime type: ${outputMime}`);
  if (!isOutputFormat(format)) {
    throw Error(`Requested to convert to an unsupported format: ${format}`);
  }
  return sharpInst[format]();
}
const blocklistedMimes = ["image/heic", "image/heif"];
const mimesBySizeDesc = [
  "image/png",
  "image/tiff",
  "image/gif",
  "image/jpeg",
  "image/webp",
  "image/avif"
];
function chooseMimeType(supportedMimes, preferredMime, mime, { preferSizeReduction }) {
  if (!supportedMimes.includes(preferredMime)) {
    const supportedMimesStr = supportedMimes.join(", ");
    throw Error(
      `Preferred format "${preferredMime}" not found in supported mimes: ${supportedMimesStr}`
    );
  }
  const [type] = mime.split("/");
  if (type !== "image") throw Error(`Received non-image mime type: ${mime}`);
  if (supportedMimes.includes(mime) && !preferSizeReduction) return mime;
  if (blocklistedMimes.includes(mime)) throw Error(`Received blocklisted mime type: ${mime}`);
  const smallestMime = mimesBySizeDesc.findLast((m) => supportedMimes.includes(m));
  return smallestMime ?? preferredMime;
}
function chooseImageSize({
  mime,
  width,
  height,
  maxWidth,
  maxHeight,
  maxSizeInMB
}) {
  const biggestDiscrepency = Math.max(1, width / maxWidth, height / maxHeight);
  let selectedWidth = Math.ceil(width / biggestDiscrepency);
  let selectedHeight = Math.ceil(height / biggestDiscrepency);
  do {
    const estimatedSize = estimateImageSizeInBytes(mime, selectedWidth, selectedHeight);
    if (estimatedSize < maxSizeInMB * 1024 * 1024) {
      return { width: selectedWidth, height: selectedHeight };
    }
    selectedWidth = Math.floor(selectedWidth / 1.1);
    selectedHeight = Math.floor(selectedHeight / 1.1);
  } while (selectedWidth > 1 && selectedHeight > 1);
  throw Error(`Failed to resize image to fit within ${maxSizeInMB}MB`);
}
const mimeToCompressionRatio = {
  "image/png": 1 / 2,
  "image/jpeg": 1 / 10,
  "image/webp": 1 / 4,
  "image/avif": 1 / 5,
  "image/tiff": 1,
  "image/gif": 1 / 5
};
function estimateImageSizeInBytes(mime, width, height) {
  const compressionRatio = mimeToCompressionRatio[mime];
  if (!compressionRatio) throw Error(`Unsupported image format: ${mime}`);
  const bitsPerPixel = 32;
  const bytesPerPixel = bitsPerPixel / 8;
  const uncompressedSize = width * height * bytesPerPixel;
  return uncompressedSize * compressionRatio;
}
function resizeImage(sharpInst, maxWidth, maxHeight) {
  return sharpInst.resize({ width: maxWidth, height: maxHeight, fit: "inside" });
}
async function prepareMessagesWithFiles(messages, imageProcessor, isMultimodal) {
  return Promise.all(
    messages.map(async (message) => {
      if (message.from === "user" && message.files && message.files.length > 0) {
        const { imageParts, textContent } = await prepareFiles(
          imageProcessor,
          message.files,
          isMultimodal
        );
        let messageText = message.content;
        if (textContent.length > 0) {
          messageText = textContent + "\n\n" + message.content;
        }
        if (imageParts.length > 0 && isMultimodal) {
          const parts = [{ type: "text", text: messageText }, ...imageParts];
          return { role: message.from, content: parts };
        }
        return { role: message.from, content: messageText };
      }
      return { role: message.from, content: message.content };
    })
  );
}
async function prepareFiles(imageProcessor, files, isMultimodal) {
  const imageFiles = files.filter((file) => file.mime.startsWith("image/"));
  const textFiles = files.filter((file) => {
    const mime = (file.mime || "").toLowerCase();
    const [fileType, fileSubtype] = mime.split("/");
    return TEXT_MIME_ALLOWLIST.some((allowed) => {
      const [type, subtype] = allowed.toLowerCase().split("/");
      const typeOk = type === "*" || type === fileType;
      const subOk = subtype === "*" || subtype === fileSubtype;
      return typeOk && subOk;
    });
  });
  let imageParts = [];
  if (isMultimodal && imageFiles.length > 0) {
    const processedFiles = await Promise.all(imageFiles.map(imageProcessor));
    imageParts = processedFiles.map((file) => ({
      type: "image_url",
      image_url: {
        url: `data:${file.mime};base64,${file.image.toString("base64")}`,
        detail: "auto"
      }
    }));
  }
  let textContent = "";
  if (textFiles.length > 0) {
    const textParts = await Promise.all(
      textFiles.map(async (file) => {
        const content = Buffer.from(file.value, "base64").toString("utf-8");
        return `<document name="${file.name}" type="${file.mime}">
${content}
</document>`;
      })
    );
    textContent = textParts.join("\n\n");
  }
  return { imageParts, textContent };
}
const endpointOAIParametersSchema = z.object({
  weight: z.number().int().positive().default(1),
  model: z.any(),
  type: z.literal("openai"),
  baseURL: z.string().url().default("https://api.openai.com/v1"),
  // Canonical auth token is OPENAI_API_KEY; keep HF_TOKEN as legacy alias
  apiKey: z.string().default(config.OPENAI_API_KEY || config.HF_TOKEN || "sk-"),
  completion: z.union([z.literal("completions"), z.literal("chat_completions")]).default("chat_completions"),
  defaultHeaders: z.record(z.string()).optional(),
  defaultQuery: z.record(z.string()).optional(),
  extraBody: z.record(z.any()).optional(),
  multimodal: z.object({
    image: createImageProcessorOptionsValidator({
      supportedMimeTypes: [
        // Restrict to the most widely-supported formats
        "image/png",
        "image/jpeg"
      ],
      preferredMimeType: "image/jpeg",
      maxSizeInMB: 1,
      maxWidth: 1024,
      maxHeight: 1024
    })
  }).default({}),
  /* enable use of max_completion_tokens in place of max_tokens */
  useCompletionTokens: z.boolean().default(false),
  streamingSupported: z.boolean().default(true)
});
async function endpointOai(input) {
  const {
    baseURL,
    apiKey,
    completion,
    model,
    defaultHeaders,
    defaultQuery,
    multimodal,
    extraBody,
    useCompletionTokens,
    streamingSupported
  } = endpointOAIParametersSchema.parse(input);
  let OpenAI;
  try {
    OpenAI = (await import("openai")).OpenAI;
  } catch (e) {
    throw new Error("Failed to import OpenAI", { cause: e });
  }
  let routerMetadata = {};
  const customFetch = async (url, init) => {
    const response = await fetch(url, init);
    const routeHeader = response.headers.get("X-Router-Route");
    const modelHeader = response.headers.get("X-Router-Model");
    const providerHeader = response.headers.get("x-inference-provider");
    if (routeHeader && modelHeader) {
      routerMetadata = {
        route: routeHeader,
        model: modelHeader,
        provider: providerHeader || void 0
      };
    } else if (providerHeader) {
      routerMetadata = {
        provider: providerHeader
      };
    }
    return response;
  };
  const openai = new OpenAI({
    apiKey: apiKey || "sk-",
    baseURL,
    defaultHeaders: {
      ...config.PUBLIC_APP_NAME === "HuggingChat" && { "User-Agent": "huggingchat" },
      ...defaultHeaders
    },
    defaultQuery,
    fetch: customFetch
  });
  const imageProcessor = makeImageProcessor(multimodal.image);
  if (completion === "completions") {
    return async ({
      messages,
      preprompt,
      generateSettings,
      conversationId,
      locals,
      abortSignal,
      provider
    }) => {
      const prompt = await buildPrompt({
        messages,
        preprompt,
        model
      });
      const baseModelId = model.id ?? model.name;
      const modelId = provider && provider !== "auto" ? `${baseModelId}:${provider}` : baseModelId;
      const parameters = { ...model.parameters, ...generateSettings };
      const body = {
        model: modelId,
        prompt,
        stream: true,
        max_tokens: parameters?.max_tokens,
        stop: parameters?.stop,
        temperature: parameters?.temperature,
        top_p: parameters?.top_p,
        frequency_penalty: parameters?.frequency_penalty,
        presence_penalty: parameters?.presence_penalty
      };
      const openAICompletion = await openai.completions.create(body, {
        body: { ...body, ...extraBody },
        headers: {
          "ChatUI-Conversation-ID": conversationId?.toString() ?? "",
          "X-use-cache": "false",
          ...locals?.token ? { Authorization: `Bearer ${locals.token}` } : {},
          // Bill to organization if configured
          ...locals?.billingOrganization ? { "X-HF-Bill-To": locals.billingOrganization } : {}
        },
        signal: abortSignal
      });
      return openAICompletionToTextGenerationStream(openAICompletion);
    };
  } else if (completion === "chat_completions") {
    return async ({
      messages,
      preprompt,
      generateSettings,
      conversationId,
      isMultimodal,
      locals,
      abortSignal,
      provider
    }) => {
      let messagesOpenAI = await prepareMessagesWithFiles(messages, imageProcessor, isMultimodal ?? model.multimodal);
      const normalizedPreprompt = typeof preprompt === "string" ? preprompt.trim() : "";
      const hasSystemMessage = messagesOpenAI.length > 0 && messagesOpenAI[0]?.role === "system";
      if (hasSystemMessage) {
        if (normalizedPreprompt) {
          const userSystemPrompt = (typeof messagesOpenAI[0].content === "string" ? messagesOpenAI[0].content : "") || "";
          messagesOpenAI[0].content = normalizedPreprompt + (userSystemPrompt ? "\n\n" + userSystemPrompt : "");
        }
      } else {
        if (normalizedPreprompt) {
          messagesOpenAI = [{ role: "system", content: normalizedPreprompt }, ...messagesOpenAI];
        }
      }
      const parameters = { ...model.parameters, ...generateSettings };
      const baseModelId = model.id ?? model.name;
      const modelId = provider && provider !== "auto" ? `${baseModelId}:${provider}` : baseModelId;
      const body = {
        model: modelId,
        messages: messagesOpenAI,
        stream: streamingSupported,
        // Support two different ways of specifying token limits depending on the model
        ...useCompletionTokens ? { max_completion_tokens: parameters?.max_tokens } : { max_tokens: parameters?.max_tokens },
        stop: parameters?.stop,
        temperature: parameters?.temperature,
        top_p: parameters?.top_p,
        frequency_penalty: parameters?.frequency_penalty,
        presence_penalty: parameters?.presence_penalty
      };
      if (streamingSupported) {
        const openChatAICompletion = await openai.chat.completions.create(
          body,
          {
            body: { ...body, ...extraBody },
            headers: {
              "ChatUI-Conversation-ID": conversationId?.toString() ?? "",
              "X-use-cache": "false",
              ...locals?.token ? { Authorization: `Bearer ${locals.token}` } : {},
              // Bill to organization if configured
              ...locals?.billingOrganization ? { "X-HF-Bill-To": locals.billingOrganization } : {}
            },
            signal: abortSignal
          }
        );
        return openAIChatToTextGenerationStream(openChatAICompletion, () => routerMetadata);
      } else {
        const openChatAICompletion = await openai.chat.completions.create(
          body,
          {
            body: { ...body, ...extraBody },
            headers: {
              "ChatUI-Conversation-ID": conversationId?.toString() ?? "",
              "X-use-cache": "false",
              ...locals?.token ? { Authorization: `Bearer ${locals.token}` } : {},
              // Bill to organization if configured
              ...locals?.billingOrganization ? { "X-HF-Bill-To": locals.billingOrganization } : {}
            },
            signal: abortSignal
          }
        );
        return openAIChatToTextGenerationSingle(openChatAICompletion, () => routerMetadata);
      }
    };
  } else {
    throw new Error("Invalid completion type");
  }
}
const endpoints = {
  openai: endpointOai
};
const endpointSchema = z.discriminatedUnion("type", [endpointOAIParametersSchema]);
let ROUTES = [];
let loaded = false;
async function loadPolicy() {
  const path = config.LLM_ROUTER_ROUTES_PATH;
  const text = await readFile(path, "utf8");
  const arr = JSON.parse(text);
  if (!Array.isArray(arr)) {
    throw new Error("Routes config must be a flat array of routes");
  }
  const seen = /* @__PURE__ */ new Set();
  for (const r of arr) {
    if (!r?.name || !r?.description || !r?.primary_model) {
      throw new Error(`Invalid route entry: ${JSON.stringify(r)}`);
    }
    if (seen.has(r.name)) {
      throw new Error(`Duplicate route name: ${r.name}`);
    }
    seen.add(r.name);
  }
  ROUTES = arr;
  loaded = true;
  return ROUTES;
}
async function getRoutes() {
  if (!loaded) await loadPolicy();
  return ROUTES;
}
function resolveRouteModels(routeName, routes, fallbackModel) {
  if (routeName === "arch_router_failure") {
    return { candidates: [fallbackModel] };
  }
  const sel = routes.find((r) => r.name === routeName) || routes.find((r) => r.name === "casual_conversation");
  if (!sel) return { candidates: [fallbackModel] };
  const fallbacks = Array.isArray(sel.fallback_models) ? sel.fallback_models : [];
  return { candidates: [sel.primary_model, ...fallbacks] };
}
const DEFAULT_LAST_TURNS = 16;
function trimMiddle(content, maxLength) {
  if (content.length <= maxLength) return content;
  const indicator = "…";
  const availableLength = maxLength - indicator.length;
  if (availableLength <= 0) {
    return content.slice(0, maxLength);
  }
  const startLength = Math.ceil(availableLength * 0.6);
  const endLength = availableLength - startLength;
  if (endLength <= 0) {
    return content.slice(0, availableLength) + indicator;
  }
  const start = content.slice(0, startLength);
  const end = content.slice(-endLength);
  return start + indicator + end;
}
const PROMPT_TEMPLATE = `
You are a helpful assistant designed to find the best suited route.
You are provided with route description within <routes></routes> XML tags:

<routes>

{routes}

</routes>

<conversation>

{conversation}

</conversation>

Your task is to decide which route is best suit with user intent on the conversation in <conversation></conversation> XML tags.

Follow those instructions:
1. Use prior turns to choose the best route for the current message if needed.
2. If no route match the full conversation respond with other route {"route": "other"}.
3. Analyze the route descriptions and find the best match route for user latest intent.
4. Respond only with the route name that best matches the user's request, using the exact name in the <routes> block.
Based on your analysis, provide your response in the following JSON format if you decide to match any route:
{"route": "route_name"}
`.trim();
function lastNTurns(arr, n = DEFAULT_LAST_TURNS) {
  if (!Array.isArray(arr)) return [];
  return arr.slice(-n);
}
function toRouterPrompt(messages, routes) {
  const simpleRoutes = routes.map((r) => ({
    name: r.name,
    description: r.description
  }));
  const maxAssistantLength = parseInt(config.LLM_ROUTER_MAX_ASSISTANT_LENGTH || "1000", 10);
  const maxPrevUserLength = parseInt(config.LLM_ROUTER_MAX_PREV_USER_LENGTH || "1000", 10);
  const convo = messages.map((m) => ({ role: m.from, content: m.content })).filter((m) => typeof m.content === "string" && m.content.trim() !== "");
  const lastUserIndex = convo.findLastIndex((m) => m.role === "user");
  const trimmedConvo = convo.map((m, idx) => {
    if (typeof m.content !== "string") return m;
    if (m.role === "assistant") {
      return {
        ...m,
        content: trimMiddle(m.content, maxAssistantLength)
      };
    }
    if (m.role === "user" && idx !== lastUserIndex) {
      return {
        ...m,
        content: trimMiddle(m.content, maxPrevUserLength)
      };
    }
    return m;
  });
  return PROMPT_TEMPLATE.replace("{routes}", JSON.stringify(simpleRoutes)).replace(
    "{conversation}",
    JSON.stringify(lastNTurns(trimmedConvo))
  );
}
function parseRouteName(text) {
  if (!text) return;
  try {
    const obj = JSON.parse(text);
    if (typeof obj?.route === "string" && obj.route.trim()) return obj.route.trim();
  } catch {
  }
  const m = text.match(/["']route["']\s*:\s*["']([^"']+)["']/);
  if (m?.[1]) return m[1].trim();
  try {
    const obj = JSON.parse(text.replace(/'/g, '"'));
    if (typeof obj?.route === "string" && obj.route.trim()) return obj.route.trim();
  } catch {
  }
  return;
}
async function archSelectRoute(messages, traceId, locals) {
  const routes = await getRoutes();
  const prompt = toRouterPrompt(messages, routes);
  const baseURL = (config.LLM_ROUTER_ARCH_BASE_URL || "").replace(/\/$/, "");
  const archModel = config.LLM_ROUTER_ARCH_MODEL || "router/omni";
  if (!baseURL) {
    logger.warn("LLM_ROUTER_ARCH_BASE_URL not set; routing will fail over to fallback.");
    return { routeName: "arch_router_failure" };
  }
  const headers = {
    Authorization: `Bearer ${getApiToken(locals)}`,
    "Content-Type": "application/json",
    // Bill to organization if configured (HuggingChat only)
    ...config.isHuggingChat && locals?.billingOrganization ? { "X-HF-Bill-To": locals.billingOrganization } : {}
  };
  const body = {
    model: archModel,
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 16,
    stream: false
  };
  const ctrl = new AbortController();
  const timeoutMs = Number(config.LLM_ROUTER_ARCH_TIMEOUT_MS || 1e4);
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: ctrl.signal
    });
    clearTimeout(to);
    if (!resp.ok) {
      let errorMessage = `arch-router ${resp.status}`;
      try {
        const errorData = await resp.json();
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        errorMessage = resp.statusText || errorMessage;
      }
      logger.warn(
        { status: resp.status, error: errorMessage, traceId },
        "[arch] router returned error"
      );
      return {
        routeName: "arch_router_failure",
        error: {
          message: errorMessage,
          statusCode: resp.status
        }
      };
    }
    const data = await resp.json();
    const text = (data?.choices?.[0]?.message?.content ?? "").toString().trim();
    const raw = parseRouteName(text);
    const other = config.LLM_ROUTER_OTHER_ROUTE || "casual_conversation";
    const chosen = raw === "other" ? other : raw || "casual_conversation";
    const exists = routes.some((r) => r.name === chosen);
    return { routeName: exists ? chosen : "casual_conversation" };
  } catch (e) {
    clearTimeout(to);
    const err = e;
    logger.warn({ err: String(e), traceId }, "arch router selection failed");
    return {
      routeName: "arch_router_failure",
      error: {
        message: err.message || String(e)
      }
    };
  }
}
const ROUTER_FAILURE = "arch_router_failure";
const ROUTER_TOOLS_ROUTE = "agentic";
function isRouterToolsBypassEnabled() {
  return (config.LLM_ROUTER_ENABLE_TOOLS || "").toLowerCase() === "true";
}
function hasActiveToolsSelection(locals) {
  try {
    const reqMcp = locals?.mcp;
    const byConfig = Array.isArray(reqMcp?.selectedServers) && (reqMcp?.selectedServers?.length ?? 0) > 0;
    const byName = Array.isArray(reqMcp?.selectedServerNames) && (reqMcp?.selectedServerNames?.length ?? 0) > 0;
    return Boolean(byConfig || byName);
  } catch {
    return false;
  }
}
function pickToolsCapableModel(models2) {
  const preferredRaw = config.LLM_ROUTER_TOOLS_MODEL;
  const preferred = preferredRaw?.trim();
  if (!preferred) {
    logger.warn("[router] tools bypass requested but LLM_ROUTER_TOOLS_MODEL is not set");
    return void 0;
  }
  if (!models2?.length) return void 0;
  const found = models2.find((m) => m.id === preferred || m.name === preferred);
  if (!found) {
    logger.warn(
      { configuredModel: preferred },
      "[router] configured tools model not found; falling back to Arch routing"
    );
    return void 0;
  }
  logger.info({ model: found.id ?? found.name }, "[router] using configured tools model");
  return found;
}
function findConfiguredMultimodalModel(models2) {
  const preferredModelId = (config.LLM_ROUTER_MULTIMODAL_MODEL || "").trim();
  if (!preferredModelId || !models2?.length) return void 0;
  return models2.find(
    (candidate) => (candidate.id === preferredModelId || candidate.name === preferredModelId) && !candidate.isRouter && candidate.multimodal
  );
}
function getConfiguredMultimodalModelId(models2) {
  const model = findConfiguredMultimodalModel(models2);
  return model?.id ?? model?.name;
}
const REASONING_BLOCK_REGEX = /<think>[\s\S]*?(?:<\/think>|$)/g;
const ROUTER_MULTIMODAL_ROUTE = "multimodal";
let cachedModels;
async function getModels() {
  if (!cachedModels) {
    const mod = await Promise.resolve().then(() => models$1);
    cachedModels = mod.models;
  }
  return cachedModels;
}
class HTTPError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HTTPError";
  }
}
function extractUpstreamError(error) {
  if (error && typeof error === "object") {
    const err = error;
    if (err.error && typeof err.error === "object" && "message" in err.error && typeof err.error.message === "string") {
      return {
        message: err.error.message,
        statusCode: typeof err.status === "number" ? err.status : void 0
      };
    }
    if (typeof err.statusCode === "number" && typeof err.message === "string") {
      return { message: err.message, statusCode: err.statusCode };
    }
    if (typeof err.status === "number" && typeof err.message === "string") {
      return { message: err.message, statusCode: err.status };
    }
    if (typeof err.message === "string") {
      return { message: err.message };
    }
  }
  return { message: String(error) };
}
function isPolicyError(statusCode) {
  if (!statusCode) return false;
  return statusCode === 400 || statusCode === 401 || statusCode === 402 || statusCode === 403;
}
function stripReasoningBlocks(text) {
  const stripped = text.replace(REASONING_BLOCK_REGEX, "");
  return stripped === text ? text : stripped.trim();
}
function stripReasoningFromMessage(message) {
  const content = typeof message.content === "string" ? stripReasoningBlocks(message.content) : message.content;
  return {
    ...message,
    content
  };
}
async function makeRouterEndpoint(routerModel) {
  return async function routerEndpoint(params) {
    const routes = await getRoutes();
    const sanitizedMessages = params.messages.map(stripReasoningFromMessage);
    const routerMultimodalEnabled = (config.LLM_ROUTER_ENABLE_MULTIMODAL || "").toLowerCase() === "true";
    const routerToolsEnabled = isRouterToolsBypassEnabled();
    const hasImageInput = sanitizedMessages.some(
      (message2) => (message2.files ?? []).some(
        (file) => typeof file?.mime === "string" && file.mime.startsWith("image/")
      )
    );
    const hasToolsActive = hasActiveToolsSelection(params.locals);
    async function createCandidateEndpoint(candidateModelId) {
      let modelForCall;
      try {
        const all = await getModels();
        modelForCall = all?.find((m) => m.id === candidateModelId || m.name === candidateModelId);
      } catch (e) {
        logger.warn({ err: String(e) }, "[router] failed to load models for candidate lookup");
      }
      if (!modelForCall) {
        modelForCall = {
          ...routerModel,
          id: candidateModelId,
          name: candidateModelId,
          displayName: candidateModelId
        };
      }
      return endpoints.openai({
        type: "openai",
        baseURL: (config.OPENAI_BASE_URL || "https://router.huggingface.co/v1").replace(/\/$/, ""),
        apiKey: getApiToken(params.locals),
        model: modelForCall,
        // Ensure streaming path is used
        streamingSupported: true
      });
    }
    async function* metadataThenStream(gen, actualModel, selectedRoute) {
      yield {
        token: { id: 0, text: "", special: true, logprob: 0 },
        generated_text: null,
        details: null,
        routerMetadata: { route: selectedRoute, model: actualModel }
      };
      for await (const ev of gen) yield ev;
    }
    if (routerMultimodalEnabled && hasImageInput) {
      let multimodalCandidate;
      try {
        const all = await getModels();
        multimodalCandidate = getConfiguredMultimodalModelId(all);
      } catch (e) {
        logger.warn({ err: String(e) }, "[router] failed to load models for multimodal lookup");
      }
      if (!multimodalCandidate) {
        throw new Error(
          "Router multimodal is enabled but LLM_ROUTER_MULTIMODAL_MODEL is not correctly configured. Remove the image or configure a multimodal model via LLM_ROUTER_MULTIMODAL_MODEL."
        );
      }
      try {
        logger.info(
          { route: ROUTER_MULTIMODAL_ROUTE, model: multimodalCandidate },
          "[router] multimodal input detected; bypassing Arch selection"
        );
        const ep = await createCandidateEndpoint(multimodalCandidate);
        const gen = await ep({ ...params });
        return metadataThenStream(gen, multimodalCandidate, ROUTER_MULTIMODAL_ROUTE);
      } catch (e) {
        const { message: message2, statusCode: statusCode2 } = extractUpstreamError(e);
        logger.error(
          {
            route: ROUTER_MULTIMODAL_ROUTE,
            model: multimodalCandidate,
            err: message2,
            ...statusCode2 && { status: statusCode2 }
          },
          "[router] multimodal fallback failed"
        );
        throw statusCode2 ? new HTTPError(message2, statusCode2) : new Error(message2);
      }
    }
    async function findToolsCandidateModel() {
      try {
        const all = await getModels();
        return pickToolsCapableModel(all);
      } catch (e) {
        logger.warn({ err: String(e) }, "[router] failed to load models for tools lookup");
        return void 0;
      }
    }
    if (routerToolsEnabled && hasToolsActive) {
      const toolsModel = await findToolsCandidateModel();
      const toolsCandidate = toolsModel?.id ?? toolsModel?.name;
      if (!toolsCandidate) ;
      else {
        try {
          logger.info(
            { route: ROUTER_TOOLS_ROUTE, model: toolsCandidate },
            "[router] tools active; bypassing Arch selection"
          );
          const ep = await createCandidateEndpoint(toolsCandidate);
          const gen = await ep({ ...params });
          return metadataThenStream(gen, toolsCandidate, ROUTER_TOOLS_ROUTE);
        } catch (e) {
          const { message: message2, statusCode: statusCode2 } = extractUpstreamError(e);
          const logData = {
            route: ROUTER_TOOLS_ROUTE,
            model: toolsCandidate,
            err: message2,
            ...statusCode2 && { status: statusCode2 }
          };
          if (statusCode2 === 402) {
            logger.warn(logData, "[router] tools fallback failed due to payment required");
          } else {
            logger.error(logData, "[router] tools fallback failed");
          }
          throw statusCode2 ? new HTTPError(message2, statusCode2) : new Error(message2);
        }
      }
    }
    const routeSelection = await archSelectRoute(sanitizedMessages, void 0, params.locals);
    if (routeSelection.routeName === ROUTER_FAILURE && routeSelection.error) {
      const { message: message2, statusCode: statusCode2 } = routeSelection.error;
      if (isPolicyError(statusCode2)) {
        logger.error(
          { err: message2, ...statusCode2 && { status: statusCode2 } },
          "[router] arch router failed with policy error, propagating to client"
        );
        throw statusCode2 ? new HTTPError(message2, statusCode2) : new Error(message2);
      }
      logger.warn(
        { err: message2, ...statusCode2 && { status: statusCode2 } },
        "[router] arch router failed with transient error, attempting fallback"
      );
    }
    const fallbackModel = config.LLM_ROUTER_FALLBACK_MODEL || routerModel.id;
    const { candidates } = resolveRouteModels(routeSelection.routeName, routes, fallbackModel);
    let lastErr = void 0;
    for (const candidate of candidates) {
      try {
        logger.info(
          { route: routeSelection.routeName, model: candidate },
          "[router] trying candidate"
        );
        const ep = await createCandidateEndpoint(candidate);
        const gen = await ep({ ...params });
        return metadataThenStream(gen, candidate, routeSelection.routeName);
      } catch (e) {
        lastErr = e;
        const { message: errMsg, statusCode: errStatus } = extractUpstreamError(e);
        logger.warn(
          {
            route: routeSelection.routeName,
            model: candidate,
            err: errMsg,
            ...errStatus && { status: errStatus }
          },
          "[router] candidate failed"
        );
        continue;
      }
    }
    const { message, statusCode } = extractUpstreamError(lastErr);
    throw statusCode ? new HTTPError(message, statusCode) : new Error(message);
  };
}
const sanitizeJSONEnv = (val, fallback) => {
  const raw = (val ?? "").trim();
  const unquoted = raw.startsWith("`") && raw.endsWith("`") ? raw.slice(1, -1) : raw;
  return unquoted || fallback;
};
const modelConfig = z.object({
  /** Used as an identifier in DB */
  id: z.string().optional(),
  /** Used to link to the model page, and for inference */
  name: z.string().default(""),
  displayName: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  logoUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  modelUrl: z.string().url().optional(),
  tokenizer: z.never().optional(),
  datasetName: z.string().min(1).optional(),
  datasetUrl: z.string().url().optional(),
  preprompt: z.string().default(""),
  prepromptUrl: z.string().url().optional(),
  chatPromptTemplate: z.never().optional(),
  promptExamples: z.array(
    z.object({
      title: z.string().min(1),
      prompt: z.string().min(1)
    })
  ).optional(),
  endpoints: z.array(endpointSchema).optional(),
  providers: z.array(z.object({ supports_tools: z.boolean().optional() }).passthrough()).optional(),
  parameters: z.object({
    temperature: z.number().min(0).max(2).optional(),
    truncate: z.number().int().positive().optional(),
    max_tokens: z.number().int().positive().optional(),
    stop: z.array(z.string()).optional(),
    top_p: z.number().positive().optional(),
    top_k: z.number().positive().optional(),
    frequency_penalty: z.number().min(-2).max(2).optional(),
    presence_penalty: z.number().min(-2).max(2).optional()
  }).passthrough().optional(),
  multimodal: z.boolean().default(false),
  multimodalAcceptedMimetypes: z.array(z.string()).optional(),
  // Aggregated tool-calling capability across providers (HF router)
  supportsTools: z.boolean().default(false),
  unlisted: z.boolean().default(false),
  embeddingModel: z.never().optional(),
  /** Used to enable/disable system prompt usage */
  systemRoleSupported: z.boolean().default(true)
});
const overrideEntrySchema = modelConfig.partial().extend({
  id: z.string().optional(),
  name: z.string().optional()
}).refine((value) => Boolean((value.id ?? value.name)?.trim()), {
  message: "Model override entry must provide an id or name"
});
const openaiBaseUrl = config.OPENAI_BASE_URL ? config.OPENAI_BASE_URL.replace(/\/$/, "") : void 0;
const isHFRouter = openaiBaseUrl === "https://router.huggingface.co/v1";
const listSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      description: z.string().optional(),
      providers: z.array(z.object({ supports_tools: z.boolean().optional() }).passthrough()).optional(),
      architecture: z.object({
        input_modalities: z.array(z.string()).optional()
      }).passthrough().optional()
    })
  )
}).passthrough();
function getChatPromptRender(_m) {
  return ({ messages, preprompt }) => {
    const parts = [];
    if (preprompt) parts.push(`[SYSTEM]
${preprompt}`);
    for (const msg of messages) {
      const role = msg.from === "assistant" ? "ASSISTANT" : msg.from.toUpperCase();
      parts.push(`[${role}]
${msg.content}`);
    }
    parts.push(`[ASSISTANT]`);
    return parts.join("\n\n");
  };
}
const processModel = async (m) => ({
  ...m,
  chatPromptRender: await getChatPromptRender(),
  id: m.id || m.name,
  displayName: m.displayName || m.name,
  preprompt: m.prepromptUrl ? await fetch(m.prepromptUrl).then((r) => r.text()) : m.preprompt,
  parameters: { ...m.parameters, stop_sequences: m.parameters?.stop },
  unlisted: m.unlisted ?? false
});
const addEndpoint = (m) => ({
  ...m,
  getEndpoint: async () => {
    if (!m.endpoints || m.endpoints.length === 0) {
      throw new Error("No endpoints configured. This build requires OpenAI-compatible endpoints.");
    }
    const endpoint = m.endpoints[0];
    if (endpoint.type !== "openai") {
      throw new Error("Only 'openai' endpoint type is supported in this build");
    }
    return await endpoints.openai({ ...endpoint, model: m });
  }
});
const buildPlaceholderModel = {
  id: "build-placeholder",
  name: "build-placeholder",
  displayName: "Build placeholder",
  preprompt: "",
  chatPromptRender: getChatPromptRender(),
  parameters: {},
  unlisted: true,
  multimodal: false,
  supportsTools: false,
  endpoints: [],
  hasInferenceAPI: false,
  isRouter: false,
  getEndpoint: async () => {
    throw new Error("Build placeholder model cannot be used at runtime");
  }
};
const inferenceApiIds = [];
const getModelOverrides = () => {
  const overridesEnv = Reflect.get(config, "MODELS") ?? "";
  if (!overridesEnv.trim()) {
    return [];
  }
  try {
    return z.array(overrideEntrySchema).parse(JSON5.parse(sanitizeJSONEnv(overridesEnv, "[]")));
  } catch (error) {
    logger.error(error, "[models] Failed to parse MODELS overrides");
    return [];
  }
};
let models = building ? [buildPlaceholderModel] : [];
let defaultModel = buildPlaceholderModel;
let taskModel = buildPlaceholderModel;
let validModelIdSchema = building ? z.literal(buildPlaceholderModel.id) : z.string();
let lastModelRefresh = /* @__PURE__ */ new Date(0);
let lastModelRefreshDurationMs = 0;
let lastModelRefreshSummary = {
  refreshedAt: /* @__PURE__ */ new Date(0),
  durationMs: 0,
  added: [],
  removed: [],
  changed: [],
  total: 0
};
let inflightRefresh = null;
const createValidModelIdSchema = (modelList) => {
  if (modelList.length === 0) {
    throw new Error("No models available to build validation schema");
  }
  const ids = new Set(modelList.map((m) => m.id));
  return z.string().refine((value) => ids.has(value), "Invalid model id");
};
const resolveTaskModel = (modelList) => {
  if (modelList.length === 0) {
    throw new Error("No models available to select task model");
  }
  if (config.TASK_MODEL) {
    const preferred = modelList.find(
      (m) => m.name === config.TASK_MODEL || m.id === config.TASK_MODEL
    );
    if (preferred) {
      return preferred;
    }
  }
  return modelList[0];
};
const signatureForModel = (model) => JSON.stringify({
  description: model.description,
  displayName: model.displayName,
  providers: model.providers,
  parameters: model.parameters,
  preprompt: model.preprompt,
  prepromptUrl: model.prepromptUrl,
  endpoints: model.endpoints?.map((endpoint) => {
    if (endpoint.type === "openai") {
      const { type, baseURL } = endpoint;
      return { type, baseURL };
    }
    return { type: endpoint.type };
  }) ?? null,
  multimodal: model.multimodal,
  multimodalAcceptedMimetypes: model.multimodalAcceptedMimetypes,
  supportsTools: model.supportsTools ?? false,
  isRouter: model.isRouter,
  hasInferenceAPI: model.hasInferenceAPI
});
const applyModelState = (newModels, startedAt) => {
  if (newModels.length === 0) {
    throw new Error("Failed to load any models from upstream");
  }
  const previousIds = new Set(models.map((m) => m.id));
  const previousSignatures = new Map(models.map((m) => [m.id, signatureForModel(m)]));
  const refreshedAt = /* @__PURE__ */ new Date();
  const durationMs = Date.now() - startedAt;
  models = newModels;
  defaultModel = models[0];
  taskModel = resolveTaskModel(models);
  validModelIdSchema = createValidModelIdSchema(models);
  lastModelRefresh = refreshedAt;
  lastModelRefreshDurationMs = durationMs;
  const added = newModels.map((m) => m.id).filter((id) => !previousIds.has(id));
  const removed = Array.from(previousIds).filter(
    (id) => !newModels.some((model) => model.id === id)
  );
  const changed = newModels.filter((model) => {
    const previousSignature = previousSignatures.get(model.id);
    return previousSignature !== void 0 && previousSignature !== signatureForModel(model);
  }).map((model) => model.id);
  const summary = {
    refreshedAt,
    durationMs,
    added,
    removed,
    changed,
    total: models.length
  };
  lastModelRefreshSummary = summary;
  logger.info(
    {
      total: summary.total,
      added: summary.added,
      removed: summary.removed,
      changed: summary.changed,
      durationMs: summary.durationMs
    },
    "[models] Model cache refreshed"
  );
  return summary;
};
const buildModels = async () => {
  if (!openaiBaseUrl) {
    logger.error(
      "OPENAI_BASE_URL is required. Set it to an OpenAI-compatible base (e.g., https://router.huggingface.co/v1)."
    );
    throw new Error("OPENAI_BASE_URL not set");
  }
  try {
    const baseURL = openaiBaseUrl;
    logger.info({ baseURL }, "[models] Using OpenAI-compatible base URL");
    const authToken = config.OPENAI_API_KEY || config.HF_TOKEN;
    const response = await fetch(`${baseURL}/models`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : void 0
    });
    logger.info({ status: response.status }, "[models] First fetch status");
    if (!response.ok && response.status === 401 && !authToken) {
      throw new Error(
        `Failed to fetch ${baseURL}/models: ${response.status} ${response.statusText} (no auth token available)`
      );
    }
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${baseURL}/models: ${response.status} ${response.statusText}`
      );
    }
    const json = await response.json();
    logger.info({ keys: Object.keys(json || {}) }, "[models] Response keys");
    const parsed = listSchema.parse(json);
    logger.info({ count: parsed.data.length }, "[models] Parsed models count");
    let modelsRaw = parsed.data.map((m) => {
      let logoUrl = void 0;
      if (isHFRouter && m.id.includes("/")) {
        const org = m.id.split("/")[0];
        logoUrl = `https://huggingface.co/api/avatars/${encodeURIComponent(org)}`;
      }
      const inputModalities = (m.architecture?.input_modalities ?? []).map(
        (modality) => modality.toLowerCase()
      );
      const supportsImageInput = inputModalities.includes("image") || inputModalities.includes("vision");
      const supportsTools = Boolean((m.providers ?? []).some((p) => p?.supports_tools === true));
      return {
        id: m.id,
        name: m.id,
        displayName: m.id,
        description: m.description,
        logoUrl,
        providers: m.providers,
        multimodal: supportsImageInput,
        multimodalAcceptedMimetypes: supportsImageInput ? ["image/*"] : void 0,
        supportsTools,
        endpoints: [
          {
            type: "openai",
            baseURL
            // apiKey will be taken from OPENAI_API_KEY or HF_TOKEN automatically
          }
        ]
      };
    });
    const overrides = getModelOverrides();
    if (overrides.length) {
      const overrideMap = /* @__PURE__ */ new Map();
      for (const override of overrides) {
        for (const key of [override.id, override.name]) {
          const trimmed = key?.trim();
          if (trimmed) overrideMap.set(trimmed, override);
        }
      }
      modelsRaw = modelsRaw.map((model) => {
        const override = overrideMap.get(model.id ?? "") ?? overrideMap.get(model.name ?? "");
        if (!override) return model;
        const { id, name, ...rest } = override;
        void id;
        void name;
        return {
          ...model,
          ...rest
        };
      });
    }
    const builtModels = await Promise.all(
      modelsRaw.map(
        (e) => processModel(e).then(addEndpoint).then(async (m) => ({
          ...m,
          hasInferenceAPI: inferenceApiIds.includes(m.id ?? m.name),
          // router decoration added later
          isRouter: false
        }))
      )
    );
    const archBase = (config.LLM_ROUTER_ARCH_BASE_URL || "").trim();
    const routerLabel = (config.PUBLIC_LLM_ROUTER_DISPLAY_NAME || "Omni").trim() || "Omni";
    const routerLogo = (config.PUBLIC_LLM_ROUTER_LOGO_URL || "").trim();
    const routerAliasId = (config.PUBLIC_LLM_ROUTER_ALIAS_ID || "omni").trim() || "omni";
    const routerMultimodalEnabled = (config.LLM_ROUTER_ENABLE_MULTIMODAL || "").toLowerCase() === "true";
    const routerToolsEnabled = (config.LLM_ROUTER_ENABLE_TOOLS || "").toLowerCase() === "true";
    let decorated = builtModels;
    if (archBase) {
      const aliasRaw = {
        id: routerAliasId,
        name: routerAliasId,
        displayName: routerLabel,
        description: "Automatically routes your messages to the best model for your request.",
        logoUrl: routerLogo || void 0,
        preprompt: "",
        endpoints: [
          {
            type: "openai",
            baseURL: openaiBaseUrl
          }
        ],
        // Keep the alias visible
        unlisted: false
      };
      if (routerMultimodalEnabled) {
        aliasRaw.multimodal = true;
        aliasRaw.multimodalAcceptedMimetypes = ["image/*"];
      }
      if (routerToolsEnabled) {
        aliasRaw.supportsTools = true;
      }
      const aliasBase = await processModel(aliasRaw);
      const aliasModel = {
        ...aliasBase,
        isRouter: true,
        hasInferenceAPI: false,
        // getEndpoint uses the router wrapper regardless of the endpoints array
        getEndpoint: async () => makeRouterEndpoint(aliasModel)
      };
      decorated = [aliasModel, ...decorated];
    }
    return decorated;
  } catch (e) {
    logger.error(e, "Failed to load models from OpenAI base URL");
    throw e;
  }
};
const rebuildModels = async () => {
  const startedAt = Date.now();
  const newModels = await buildModels();
  return applyModelState(newModels, startedAt);
};
if (!building) {
  await rebuildModels();
}
const refreshModels = async () => {
  if (inflightRefresh) {
    return inflightRefresh;
  }
  inflightRefresh = rebuildModels().finally(() => {
    inflightRefresh = null;
  });
  return inflightRefresh;
};
const validateModel = (_models) => {
  return z.enum([_models[0].id, ..._models.slice(1).map((m) => m.id)]);
};
const models$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get defaultModel() {
    return defaultModel;
  },
  get lastModelRefresh() {
    return lastModelRefresh;
  },
  get lastModelRefreshDurationMs() {
    return lastModelRefreshDurationMs;
  },
  get lastModelRefreshSummary() {
    return lastModelRefreshSummary;
  },
  get models() {
    return models;
  },
  refreshModels,
  get taskModel() {
    return taskModel;
  },
  get validModelIdSchema() {
    return validModelIdSchema;
  },
  validateModel
}, Symbol.toStringTag, { value: "Module" }));
export {
  ROUTER_TOOLS_ROUTE as R,
  validateModel as a,
  archSelectRoute as b,
  resolveRouteModels as c,
  defaultModel as d,
  prepareMessagesWithFiles as e,
  findConfiguredMultimodalModel as f,
  getRoutes as g,
  hasActiveToolsSelection as h,
  isRouterToolsBypassEnabled as i,
  makeImageProcessor as j,
  buildPrompt as k,
  lastModelRefreshSummary as l,
  models as m,
  models$1 as n,
  pickToolsCapableModel as p,
  refreshModels as r,
  taskModel as t,
  validModelIdSchema as v
};
