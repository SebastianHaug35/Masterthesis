import { c as config } from "./config.js";
import { l as logger } from "./logger.js";
import { v4 } from "uuid";
class AdminTokenManager {
  constructor() {
    this.token = config.ADMIN_TOKEN || v4();
    this.adminSessions = [];
  }
  get enabled() {
    return config.ADMIN_CLI_LOGIN === "true";
  }
  isAdmin(sessionId) {
    if (!this.enabled) return false;
    return this.adminSessions.includes(sessionId);
  }
  checkToken(token, sessionId) {
    if (!this.enabled) return false;
    if (token === this.token) {
      logger.info(`[ADMIN] Token validated`);
      this.adminSessions.push(sessionId);
      this.token = config.ADMIN_TOKEN || v4();
      return true;
    }
    return false;
  }
  removeSession(sessionId) {
    this.adminSessions = this.adminSessions.filter((id) => id !== sessionId);
  }
  displayToken() {
    if (!this.enabled || config.ADMIN_TOKEN) return;
    let port = process.env.PORT ? parseInt(process.env.PORT) : process.argv.includes("--port") ? parseInt(process.argv[process.argv.indexOf("--port") + 1]) : void 0;
    if (!port) {
      const mode = process.argv.find((arg) => arg === "preview" || arg === "dev");
      if (mode === "preview") {
        port = 4173;
      } else if (mode === "dev") {
        port = 5173;
      } else {
        port = 3e3;
      }
    }
    const url = (config.PUBLIC_ORIGIN || `http://localhost:${port}`) + "?token=";
    logger.info(`[ADMIN] You can login with ${url + this.token}`);
  }
}
const adminTokenManager = new AdminTokenManager();
export {
  adminTokenManager as a
};
