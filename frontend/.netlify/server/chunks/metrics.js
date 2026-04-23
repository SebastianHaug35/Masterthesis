import { Registry, collectDefaultMetrics, Summary, Counter } from "prom-client";
import { l as logger } from "./logger.js";
import { c as config } from "./config.js";
import { createServer } from "http";
import { o as onExit } from "./exitHandler.js";
class MetricsServer {
  constructor() {
    this.enabled = config.METRICS_ENABLED === "true";
    this.register = new Registry();
    if (this.enabled) {
      collectDefaultMetrics({ register: this.register });
    }
    this.metrics = this.createMetrics();
    if (this.enabled) {
      this.startStandaloneServer();
    }
  }
  static getInstance() {
    if (!MetricsServer.instance) {
      MetricsServer.instance = new MetricsServer();
    }
    return MetricsServer.instance;
  }
  static getMetrics() {
    return MetricsServer.getInstance().metrics;
  }
  static isEnabled() {
    return config.METRICS_ENABLED === "true";
  }
  async render() {
    if (!this.enabled) {
      return "";
    }
    return this.register.metrics();
  }
  createMetrics() {
    const labelNames = ["model"];
    const noopRegistry = new Registry();
    const registry = this.enabled ? this.register : noopRegistry;
    return {
      model: {
        conversationsTotal: new Counter({
          name: "model_conversations_total",
          help: "Total number of conversations",
          labelNames,
          registers: [registry]
        }),
        messagesTotal: new Counter({
          name: "model_messages_total",
          help: "Total number of messages",
          labelNames,
          registers: [registry]
        }),
        tokenCountTotal: new Counter({
          name: "model_token_count_total",
          help: "Total number of tokens emitted by the model",
          labelNames,
          registers: [registry]
        }),
        timePerOutputToken: new Summary({
          name: "model_time_per_output_token_ms",
          help: "Per-token latency in milliseconds",
          labelNames,
          registers: [registry],
          maxAgeSeconds: 5 * 60,
          ageBuckets: 5
        }),
        timeToFirstToken: new Summary({
          name: "model_time_to_first_token_ms",
          help: "Time to first token in milliseconds",
          labelNames,
          registers: [registry],
          maxAgeSeconds: 5 * 60,
          ageBuckets: 5
        }),
        latency: new Summary({
          name: "model_latency_ms",
          help: "Total time to complete a response in milliseconds",
          labelNames,
          registers: [registry],
          maxAgeSeconds: 5 * 60,
          ageBuckets: 5
        })
      }
    };
  }
  startStandaloneServer() {
    const port = Number(config.METRICS_PORT || "5565");
    if (!Number.isInteger(port) || port < 0 || port > 65535) {
      logger.warn(`Invalid METRICS_PORT value: ${config.METRICS_PORT}`);
      return;
    }
    this.httpServer = createServer(async (req, res) => {
      if (req.method !== "GET") {
        res.statusCode = 405;
        res.end("Method Not Allowed");
        return;
      }
      try {
        const payload = await this.render();
        res.setHeader("Content-Type", "text/plain; version=0.0.4");
        res.end(payload);
      } catch (error) {
        logger.error(error, "Failed to render metrics");
        res.statusCode = 500;
        res.end("Failed to render metrics");
      }
    });
    this.httpServer.listen(port, () => {
      logger.info(`Metrics server listening on port ${port}`);
    });
    onExit(async () => {
      if (!this.httpServer) return;
      logger.info("Shutting down metrics server...");
      await new Promise((resolve, reject) => {
        this.httpServer?.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      }).catch((error) => logger.error(error, "Failed to close metrics server"));
      this.httpServer = void 0;
    });
  }
}
export {
  MetricsServer as M
};
