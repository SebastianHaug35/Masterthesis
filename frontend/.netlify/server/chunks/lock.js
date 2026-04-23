import { collections } from "./database.js";
import { ObjectId } from "mongodb";
async function acquireLock(key) {
  try {
    const id = new ObjectId();
    const insert = await collections.semaphores.insertOne({
      _id: id,
      key,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      deleteAt: new Date(Date.now() + 1e3 * 60 * 3)
      // 3 minutes
    });
    return insert.acknowledged ? id : false;
  } catch (e) {
    return false;
  }
}
async function releaseLock(key, lockId) {
  await collections.semaphores.deleteOne({
    _id: lockId,
    key
  });
}
async function isDBLocked(key) {
  const res = await collections.semaphores.countDocuments({
    key
  });
  return res > 0;
}
async function refreshLock(key, lockId) {
  const result = await collections.semaphores.updateOne(
    {
      _id: lockId,
      key
    },
    {
      $set: {
        updatedAt: /* @__PURE__ */ new Date(),
        deleteAt: new Date(Date.now() + 1e3 * 60 * 3)
        // 3 minutes
      }
    }
  );
  return result.matchedCount > 0;
}
export {
  acquireLock as a,
  refreshLock as b,
  isDBLocked as i,
  releaseLock as r
};
