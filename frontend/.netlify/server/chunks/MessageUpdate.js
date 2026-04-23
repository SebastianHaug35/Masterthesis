var MessageUpdateType = /* @__PURE__ */ ((MessageUpdateType2) => {
  MessageUpdateType2["Status"] = "status";
  MessageUpdateType2["Title"] = "title";
  MessageUpdateType2["Tool"] = "tool";
  MessageUpdateType2["Stream"] = "stream";
  MessageUpdateType2["File"] = "file";
  MessageUpdateType2["FinalAnswer"] = "finalAnswer";
  MessageUpdateType2["Reasoning"] = "reasoning";
  MessageUpdateType2["RouterMetadata"] = "routerMetadata";
  return MessageUpdateType2;
})(MessageUpdateType || {});
var MessageUpdateStatus = /* @__PURE__ */ ((MessageUpdateStatus2) => {
  MessageUpdateStatus2["Started"] = "started";
  MessageUpdateStatus2["Error"] = "error";
  MessageUpdateStatus2["Finished"] = "finished";
  MessageUpdateStatus2["KeepAlive"] = "keepAlive";
  return MessageUpdateStatus2;
})(MessageUpdateStatus || {});
var MessageToolUpdateType = /* @__PURE__ */ ((MessageToolUpdateType2) => {
  MessageToolUpdateType2["Call"] = "call";
  MessageToolUpdateType2["Result"] = "result";
  MessageToolUpdateType2["Error"] = "error";
  MessageToolUpdateType2["ETA"] = "eta";
  MessageToolUpdateType2["Progress"] = "progress";
  return MessageToolUpdateType2;
})(MessageToolUpdateType || {});
var MessageReasoningUpdateType = /* @__PURE__ */ ((MessageReasoningUpdateType2) => {
  MessageReasoningUpdateType2["Stream"] = "stream";
  MessageReasoningUpdateType2["Status"] = "status";
  return MessageReasoningUpdateType2;
})(MessageReasoningUpdateType || {});
export {
  MessageUpdateType as M,
  MessageToolUpdateType as a,
  MessageReasoningUpdateType as b,
  MessageUpdateStatus as c
};
