import { M as MessageUpdateType, a as MessageToolUpdateType } from "./MessageUpdate.js";
async function fetchMessageUpdates(conversationId, opts, abortSignal) {
  const abortController = new AbortController();
  abortSignal.addEventListener("abort", () => abortController.abort());
  const form = new FormData();
  const optsJSON = JSON.stringify({
    inputs: opts.inputs,
    id: opts.messageId,
    is_retry: opts.isRetry,
    is_continue: Boolean(opts.isContinue),
    // Will be ignored server-side if unsupported
    selectedMcpServerNames: opts.selectedMcpServerNames,
    selectedMcpServers: opts.selectedMcpServers
  });
  opts.files?.forEach((file) => {
    const name = file.type + ";" + file.name;
    form.append("files", new File([file.value], name, { type: file.mime }));
  });
  form.append("data", optsJSON);
  const response = await fetch(`${opts.base}/conversation/${conversationId}`, {
    method: "POST",
    body: form,
    signal: abortController.signal
  });
  if (!response.ok) {
    const errorMessage = await response.json().then((obj) => obj.message).catch(() => `Request failed with status code ${response.status}: ${response.statusText}`);
    throw Error(errorMessage);
  }
  if (!response.body) {
    throw Error("Body not defined");
  }
  return applyStreamingMode(
    endpointStreamToIterator(response, abortController),
    opts.streamingMode ?? "smooth"
  );
}
function applyStreamingMode(iterator, streamingMode) {
  if (streamingMode === "smooth") {
    return smoothStreamUpdates(iterator);
  }
  return iterator;
}
function resolveStreamingMode(s) {
  return s.streamingMode === "raw" || s.streamingMode === "smooth" ? s.streamingMode : "smooth";
}
async function* endpointStreamToIterator(response, abortController) {
  const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
  if (!reader) throw Error("Response for endpoint had no body");
  reader.closed.then(() => abortController.abort());
  abortController.signal.addEventListener("abort", () => reader.cancel());
  let prevChunk = "";
  while (!abortController.signal.aborted) {
    const { done, value } = await reader.read();
    if (done) {
      abortController.abort();
      break;
    }
    if (!value) continue;
    const { messageUpdates, remainingText } = parseMessageUpdates(prevChunk + value);
    prevChunk = remainingText;
    for (const messageUpdate of messageUpdates) yield messageUpdate;
  }
}
function parseMessageUpdates(value) {
  const inputs = value.split("\n");
  const messageUpdates = [];
  for (const input of inputs) {
    try {
      messageUpdates.push(JSON.parse(input));
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          messageUpdates,
          remainingText: inputs.at(-1) ?? ""
        };
      }
    }
  }
  return { messageUpdates, remainingText: "" };
}
async function* smoothStreamUpdates(iterator, {
  minDelayMs = 5,
  maxDelayMs = 80,
  minRateCharsPerMs = 0.3,
  maxBufferedMs = 400,
  _internal: { now = () => performance.now(), sleep = defaultSleep, detectChunk } = {}
} = {}) {
  const chunkDetector = detectChunk ?? createWordChunkDetector();
  const eventTarget = new EventTarget();
  const outputQueue = [];
  let producerDone = false;
  let producerError = null;
  let pendingBuffer = "";
  let queuedStreamChars = 0;
  const enqueue = (update) => {
    if (update.type === MessageUpdateType.Stream) {
      queuedStreamChars += update.token.length;
    }
    outputQueue.push({ update });
    eventTarget.dispatchEvent(new Event("next"));
  };
  const flushPendingBuffer = () => {
    if (pendingBuffer.length === 0) return;
    enqueue({ type: MessageUpdateType.Stream, token: pendingBuffer });
    pendingBuffer = "";
  };
  const producer = (async () => {
    for await (const messageUpdate of iterator) {
      if (messageUpdate.type !== MessageUpdateType.Stream) {
        flushPendingBuffer();
        enqueue(messageUpdate);
        continue;
      }
      if (!messageUpdate.token) continue;
      pendingBuffer += messageUpdate.token;
      let chunk;
      while ((chunk = chunkDetector(pendingBuffer)) !== null) {
        if (chunk.length === 0) break;
        enqueue({ type: MessageUpdateType.Stream, token: chunk });
        pendingBuffer = pendingBuffer.slice(chunk.length);
      }
    }
    flushPendingBuffer();
  })().catch((error) => {
    producerError = error;
  }).finally(() => {
    producerDone = true;
    eventTarget.dispatchEvent(new Event("next"));
  });
  let totalCharsEmitted = 0;
  let firstEmitAt = null;
  while (!producerDone || outputQueue.length > 0) {
    if (outputQueue.length === 0) {
      await waitForEvent(eventTarget, "next");
      continue;
    }
    const next = outputQueue.shift();
    if (!next) continue;
    if (next.update.type === MessageUpdateType.Stream) {
      const tokenLen = next.update.token.length;
      queuedStreamChars = Math.max(0, queuedStreamChars - tokenLen);
      totalCharsEmitted += tokenLen;
      if (firstEmitAt === null) firstEmitAt = now();
      const elapsedMs = now() - firstEmitAt;
      const currentRate = elapsedMs > 0 ? totalCharsEmitted / elapsedMs : 0;
      const backlogChars = tokenLen + queuedStreamChars;
      const backlogRate = maxBufferedMs > 0 ? backlogChars / maxBufferedMs : 0;
      const targetRate = Math.max(currentRate, minRateCharsPerMs, backlogRate);
      const rawDelay = tokenLen / targetRate;
      const underBacklogPressure = backlogRate > minRateCharsPerMs;
      const effectiveMinDelayMs = underBacklogPressure ? 0 : minDelayMs;
      const delayMs = Math.round(Math.max(effectiveMinDelayMs, Math.min(maxDelayMs, rawDelay)));
      if (delayMs > 0) {
        await sleep(delayMs);
      }
    }
    yield next.update;
  }
  await producer;
  if (producerError) throw producerError;
}
function createWordChunkDetector() {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(void 0, { granularity: "word" });
    return (buffer) => {
      if (buffer.length === 0) return null;
      let cursor = 0;
      let boundary = 0;
      let sawWordLike = false;
      for (const part of segmenter.segment(buffer)) {
        cursor += part.segment.length;
        if (part.isWordLike) {
          sawWordLike = true;
          continue;
        }
        if (sawWordLike) {
          boundary = cursor;
          break;
        }
      }
      return boundary > 0 ? buffer.slice(0, boundary) : null;
    };
  }
  const wordWithTrailingBoundary = /\S+\s+/m;
  return (buffer) => {
    const match = wordWithTrailingBoundary.exec(buffer);
    if (!match) return null;
    return buffer.slice(0, match.index) + match[0];
  };
}
const isMessageToolUpdate = (update) => update.type === MessageUpdateType.Tool;
const isMessageToolCallUpdate = (update) => isMessageToolUpdate(update) && update.subtype === MessageToolUpdateType.Call;
const isMessageToolResultUpdate = (update) => isMessageToolUpdate(update) && update.subtype === MessageToolUpdateType.Result;
const isMessageToolErrorUpdate = (update) => isMessageToolUpdate(update) && update.subtype === MessageToolUpdateType.Error;
const isMessageToolProgressUpdate = (update) => isMessageToolUpdate(update) && update.subtype === MessageToolUpdateType.Progress;
const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitForEvent = (eventTarget, eventName) => new Promise(
  (resolve) => eventTarget.addEventListener(eventName, () => resolve(true), { once: true })
);
export {
  isMessageToolResultUpdate as a,
  isMessageToolErrorUpdate as b,
  isMessageToolProgressUpdate as c,
  isMessageToolUpdate as d,
  fetchMessageUpdates as f,
  isMessageToolCallUpdate as i,
  resolveStreamingMode as r
};
