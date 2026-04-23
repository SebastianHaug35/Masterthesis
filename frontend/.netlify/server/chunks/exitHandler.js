import { l as logger } from "./logger.js";
function randomUUID() {
  if (!("randomUUID" in crypto)) {
    return "10000000-1000-4000-8000-100000000000".replace(
      /[018]/g,
      (c) => (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4).toString(16)
    );
  }
  return crypto.randomUUID();
}
const timeout = (prom, time) => {
  let timer;
  return Promise.race([
    prom,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timeout after ${time / 1e3} seconds`)), time);
    })
  ]).finally(() => clearTimeout(timer));
};
const listeners = /* @__PURE__ */ new Map();
function onExit(cb) {
  const uuid = randomUUID();
  listeners.set(uuid, cb);
  return () => {
    listeners.delete(uuid);
  };
}
async function runExitHandler(handler) {
  return timeout(Promise.resolve().then(handler), 3e4).catch((err) => {
    logger.error(err, "Exit handler failed to run");
  });
}
function initExitHandler() {
  let signalCount = 0;
  const exitHandler = async () => {
    if (signalCount === 1) {
      logger.info("Received signal... Exiting");
      await Promise.all(Array.from(listeners.values()).map(runExitHandler));
      logger.info("All exit handlers ran... Waiting for svelte server to exit");
    }
  };
  process.on("SIGINT", () => {
    signalCount++;
    if (signalCount >= 2) {
      process.kill(process.pid, "SIGKILL");
    } else {
      exitHandler().catch((err) => {
        logger.error(err, "Error in exit handler on SIGINT:");
        process.kill(process.pid, "SIGKILL");
      });
    }
  });
  process.on("SIGTERM", () => {
    signalCount++;
    if (signalCount >= 2) {
      process.kill(process.pid, "SIGKILL");
    } else {
      exitHandler().catch((err) => {
        logger.error(err, "Error in exit handler on SIGTERM:");
        process.kill(process.pid, "SIGKILL");
      });
    }
  });
}
export {
  initExitHandler as i,
  onExit as o
};
