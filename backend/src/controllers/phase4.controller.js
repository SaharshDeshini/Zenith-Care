const { db } = require("../config/firebase");
const { Timestamp } = require("firebase-admin/firestore");

/**
 * PAUSE QUEUE (Emergency)
 */
const pauseQueue = async (req, res) => {
  const { queueId } = req.params;

  const queueRef = db.collection("queues").doc(queueId);
  const queueSnap = await queueRef.get();

  if (!queueSnap.exists) {
    return res.status(404).json({ error: "Queue not found" });
  }

  if (queueSnap.data().status === "paused") {
    return res.status(400).json({ error: "Queue already paused" });
  }

  await queueRef.update({
    status: "paused",
    pausedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return res.json({ message: "Queue paused successfully" });
};

/**
 * RESUME QUEUE
 */
const resumeQueue = async (req, res) => {
  const { queueId } = req.params;

  const queueRef = db.collection("queues").doc(queueId);
  const queueSnap = await queueRef.get();

  if (!queueSnap.exists) {
    return res.status(404).json({ error: "Queue not found" });
  }

  if (queueSnap.data().status !== "paused") {
    return res.status(400).json({ error: "Queue is not paused" });
  }

  await queueRef.update({
    status: "active",
    resumeAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return res.json({ message: "Queue resumed successfully" });
};

module.exports = {
  pauseQueue,
  resumeQueue,
};
