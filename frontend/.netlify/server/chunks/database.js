import { MongoClient, GridFSBucket, ReadPreference } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { l as logger } from "./logger.js";
import { b as building } from "./environment.js";
import { o as onExit } from "./exitHandler.js";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { existsSync, mkdirSync } from "fs";
import { c as config } from "./config.js";
function findRepoRoot(startPath) {
  let currentPath = startPath;
  while (currentPath !== "/") {
    if (existsSync(join(currentPath, "package.json"))) {
      return currentPath;
    }
    currentPath = dirname(currentPath);
  }
  throw new Error("Could not find repository root (no package.json found)");
}
const CONVERSATION_STATS_COLLECTION = "conversations.stats";
const isNetlifyRuntime = process.env.NETLIFY === "true" || Boolean(process.env.NETLIFY_IMAGES_CDN_DOMAIN);
function resolveLocalDbFolder() {
  if (config.MONGO_STORAGE_PATH) {
    return config.MONGO_STORAGE_PATH;
  }
  try {
    return join(findRepoRoot(dirname(fileURLToPath(import.meta.url))), "db");
  } catch (error) {
    throw new Error(
      "MONGODB_URL is required in this deployment environment. The local embedded MongoDB fallback only works from a checked-out repository on a writable filesystem.",
      { cause: error }
    );
  }
}
class Database {
  async init() {
    if (!config.MONGODB_URL) {
      if (isNetlifyRuntime) {
        throw new Error(
          "MONGODB_URL is required on Netlify. Configure a MongoDB Atlas connection string in Netlify environment variables."
        );
      }
      const DB_FOLDER = resolveLocalDbFolder();
      logger.warn("No MongoDB URL found, using in-memory server");
      logger.info(`Using database path: ${DB_FOLDER}`);
      if (!existsSync(DB_FOLDER)) {
        logger.info(`Creating database directory at ${DB_FOLDER}`);
        mkdirSync(DB_FOLDER, { recursive: true });
      }
      this.mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: config.MONGODB_DB_NAME + "",
          dbPath: DB_FOLDER
        },
        binary: {
          version: "7.0.18"
        }
      });
      this.client = new MongoClient(this.mongoServer.getUri(), {
        directConnection: config.MONGODB_DIRECT_CONNECTION === "true"
      });
    } else {
      this.client = new MongoClient(config.MONGODB_URL, {
        directConnection: config.MONGODB_DIRECT_CONNECTION === "true"
      });
    }
    try {
      logger.info("Connecting to database");
      await this.client.connect();
      logger.info("Connected to database");
      this.client.db(config.MONGODB_DB_NAME + (false ? "-test" : ""));
      await this.initDatabase();
    } catch (err) {
      logger.error(err, "Error connecting to database");
      throw err;
    }
    onExit(async () => {
      logger.info("Closing database connection");
      await this.client?.close(true);
      await this.mongoServer?.stop();
    });
  }
  static async getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
      await Database.instance.init();
    }
    return Database.instance;
  }
  /**
   * Return mongoClient
   */
  getClient() {
    if (!this.client) {
      throw new Error("Database not initialized");
    }
    return this.client;
  }
  /**
   * Return map of database's collections
   */
  getCollections() {
    if (!this.client) {
      throw new Error("Database not initialized");
    }
    const db = this.client.db(
      config.MONGODB_DB_NAME + ""
    );
    const conversations = db.collection("conversations");
    const settings = db.collection("settings");
    const users = db.collection("users");
    const sessions = db.collection("sessions");
    const messageEvents = db.collection("messageEvents");
    const abortedGenerations = db.collection("abortedGenerations");
    const semaphores = db.collection("semaphores");
    const tokenCaches = db.collection("tokens");
    const configCollection = db.collection("config");
    const migrationResults = db.collection("migrationResults");
    const sharedConversations = db.collection("sharedConversations");
    const bucket = new GridFSBucket(db, { bucketName: "files" });
    const secondaryPreferred = ReadPreference.SECONDARY_PREFERRED;
    const assistants = db.collection("assistants", {
      readPreference: secondaryPreferred
    });
    const conversationStats = db.collection(CONVERSATION_STATS_COLLECTION, {
      readPreference: secondaryPreferred
    });
    const reports = db.collection("reports", {
      readPreference: secondaryPreferred
    });
    const tools = db.collection("tools", {
      readPreference: secondaryPreferred
    });
    return {
      conversations,
      conversationStats,
      assistants,
      reports,
      sharedConversations,
      abortedGenerations,
      settings,
      users,
      sessions,
      messageEvents,
      bucket,
      migrationResults,
      semaphores,
      tokenCaches,
      tools,
      config: configCollection
    };
  }
  /**
   * Init database once connected: Index creation
   * @private
   */
  initDatabase() {
    const {
      conversations,
      conversationStats,
      assistants,
      reports,
      sharedConversations,
      abortedGenerations,
      settings,
      users,
      sessions,
      messageEvents,
      semaphores,
      tokenCaches,
      config: config2
    } = this.getCollections();
    conversations.createIndex(
      { sessionId: 1, updatedAt: -1 },
      { partialFilterExpression: { sessionId: { $exists: true } } }
    ).catch(
      (e) => logger.error(e, "Error creating index for conversations by sessionId and updatedAt")
    );
    conversations.createIndex(
      { userId: 1, updatedAt: -1 },
      { partialFilterExpression: { userId: { $exists: true } } }
    ).catch(
      (e) => logger.error(e, "Error creating index for conversations by userId and updatedAt")
    );
    conversations.createIndex(
      { "message.id": 1, "message.ancestors": 1 },
      { partialFilterExpression: { userId: { $exists: true } } }
    ).catch(
      (e) => logger.error(e, "Error creating index for conversations by messageId and ancestors")
    );
    conversations.createIndex({ "messages.createdAt": 1 }, { sparse: true }).catch(
      (e) => logger.error(e, "Error creating index for conversations by messages createdAt")
    );
    conversationStats.createIndex(
      {
        type: 1,
        "date.field": 1,
        "date.span": 1,
        "date.at": 1,
        distinct: 1
      },
      { unique: true }
    ).catch(
      (e) => logger.error(
        e,
        "Error creating index for conversationStats by type, date.field and date.span"
      )
    );
    conversationStats.createIndex({
      type: 1,
      "date.field": 1,
      "date.at": 1
    }).catch((e) => logger.error(e, "Error creating index for abortedGenerations by updatedAt"));
    abortedGenerations.createIndex({ updatedAt: 1 }, { expireAfterSeconds: 30 }).catch(
      (e) => logger.error(
        e,
        "Error creating index for abortedGenerations by updatedAt and expireAfterSeconds"
      )
    );
    abortedGenerations.createIndex({ conversationId: 1 }, { unique: true }).catch(
      (e) => logger.error(e, "Error creating index for abortedGenerations by conversationId")
    );
    sharedConversations.createIndex({ hash: 1 }, { unique: true }).catch((e) => logger.error(e));
    settings.createIndex({ sessionId: 1 }, { unique: true, sparse: true }).catch((e) => logger.error(e, "Error creating index for settings by sessionId"));
    settings.createIndex({ userId: 1 }, { unique: true, sparse: true }).catch((e) => logger.error(e, "Error creating index for settings by userId"));
    settings.createIndex({ assistants: 1 }).catch((e) => logger.error(e, "Error creating index for settings by assistants"));
    users.createIndex({ hfUserId: 1 }, { unique: true }).catch((e) => logger.error(e, "Error creating index for users by hfUserId"));
    users.createIndex({ sessionId: 1 }, { unique: true, sparse: true }).catch((e) => logger.error(e, "Error creating index for users by sessionId"));
    users.createIndex({ username: 1 }).catch((e) => logger.error(e, "Error creating index for users by username"));
    users.createIndex({ createdAt: 1 }).catch((e) => logger.error(e, "Error creating index for users by createdAt"));
    messageEvents.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 1 }).catch((e) => logger.error(e, "Error creating index for messageEvents by expiresAt"));
    sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch((e) => logger.error(e));
    sessions.createIndex({ sessionId: 1 }, { unique: true }).catch((e) => logger.error(e, "Error creating index for sessions by sessionId"));
    assistants.createIndex({ createdById: 1, userCount: -1 }).catch(
      (e) => logger.error(e, "Error creating index for assistants by createdById and userCount")
    );
    assistants.createIndex({ userCount: 1 }).catch((e) => logger.error(e, "Error creating index for assistants by userCount"));
    assistants.createIndex({ review: 1, userCount: -1 }).catch((e) => logger.error(e, "Error creating index for assistants by review and userCount"));
    assistants.createIndex({ modelId: 1, userCount: -1 }).catch(
      (e) => logger.error(e, "Error creating index for assistants by modelId and userCount")
    );
    assistants.createIndex({ searchTokens: 1 }).catch((e) => logger.error(e, "Error creating index for assistants by searchTokens"));
    assistants.createIndex({ last24HoursCount: 1 }).catch((e) => logger.error(e, "Error creating index for assistants by last24HoursCount"));
    assistants.createIndex({ last24HoursUseCount: -1, useCount: -1, _id: 1 }).catch(
      (e) => logger.error(e, "Error creating index for assistants by last24HoursUseCount and useCount")
    );
    reports.createIndex({ assistantId: 1 }).catch((e) => logger.error(e, "Error creating index for reports by assistantId"));
    reports.createIndex({ createdBy: 1, assistantId: 1 }).catch(
      (e) => logger.error(e, "Error creating index for reports by createdBy and assistantId")
    );
    semaphores.createIndex({ key: 1 }, { unique: true }).catch((e) => logger.error(e));
    semaphores.createIndex({ deleteAt: 1 }, { expireAfterSeconds: 1 }).catch((e) => logger.error(e, "Error creating index for semaphores by deleteAt"));
    tokenCaches.createIndex({ createdAt: 1 }, { expireAfterSeconds: 5 * 60 }).catch((e) => logger.error(e, "Error creating index for tokenCaches by createdAt"));
    tokenCaches.createIndex({ tokenHash: 1 }).catch((e) => logger.error(e, "Error creating index for tokenCaches by tokenHash"));
    conversations.createIndex({
      "messages.from": 1,
      createdAt: 1
    }).catch(
      (e) => logger.error(e, "Error creating index for conversations by messages from and createdAt")
    );
    conversations.createIndex({
      userId: 1,
      sessionId: 1
    }).catch(
      (e) => logger.error(e, "Error creating index for conversations by userId and sessionId")
    );
    conversations.createIndex({ createdAt: 1 }).catch((e) => logger.error(e, "Error creating index for conversations by createdAt"));
    conversations.createIndex({ updatedAt: 1 }).catch((e) => logger.error(e, "Error creating index for conversations by updatedAt"));
    config2.createIndex({ key: 1 }, { unique: true }).catch((e) => logger.error(e, "Error creating index for config by key"));
  }
}
let collections;
const ready = (async () => {
  if (!building) {
    const db = await Database.getInstance();
    collections = db.getCollections();
  } else {
    collections = {};
  }
})();
async function getCollectionsEarly() {
  await ready;
  if (!collections) {
    throw new Error("Database not initialized");
  }
  return collections;
}
export {
  CONVERSATION_STATS_COLLECTION,
  Database,
  collections,
  getCollectionsEarly,
  ready
};
