const { db } = require("../config/firebase");
const { Timestamp } = require("firebase-admin/firestore");
const { recalculateETAForQueue } =
  require("../utils/recalculateEta");

/**
 * CHECK-IN PATIENT
 */
const checkInPatient = async (req, res) => {
  const { appointmentId } = req.body;

  // 1️⃣ Fetch appointment
  const apptRef = db.collection("appointments").doc(appointmentId);
  const apptSnap = await apptRef.get();

  if (!apptSnap.exists) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  const { queueId } = apptSnap.data();

  // 2️⃣ Fetch queue (for pause check)
  const queueRef = db.collection("queues").doc(queueId);
  const queueSnap = await queueRef.get();

  if (!queueSnap.exists) {
    return res.status(404).json({ error: "Queue not found" });
  }

  if (queueSnap.data().status === "paused") {
    return res.status(400).json({
      error: "Queue is paused. Cannot check-in.",
    });
  }

  // 3️⃣ Update appointment
  await apptRef.update({
    status: "checked_in",
    checkedInAt: Timestamp.now(),
  });

  // 4️⃣ Recalculate ETA
  await recalculateETAForQueue(queueId);

  res.json({ message: "Patient checked in" });
};

/**
 * SEND NEXT PATIENT
 */
const sendNextPatient = async (req, res) => {
  const { queueId } = req.params;

  if (!queueId) {
    return res.status(400).json({ error: "queueId is required" });
  }

  const queueRef = db.collection("queues").doc(queueId);
  const queueSnap = await queueRef.get();

  if (!queueSnap.exists) {
    return res.status(404).json({ error: "Queue not found" });
  }

  if (queueSnap.data().status === "paused") {
    return res.status(400).json({
      error: "Queue is paused. Cannot advance.",
    });
  }

  const { currentIndex } = queueSnap.data();

  const apptSnap = await db
    .collection("appointments")
    .where("queueId", "==", queueId)
    .orderBy("queueNumber")
    .get();

  const appointments = apptSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  // 1️⃣ Complete previous patient
  const previous = appointments.find(
    (a) => a.queueNumber === currentIndex
  );

  if (previous && previous.id) {
    await db.collection("appointments").doc(previous.id).update({
      status: "completed",
      completedAt: Timestamp.now(),
    });
  }

  // 2️⃣ Auto-move missed patient to waiting
  const missed = appointments.find(
    (a) =>
      a.queueNumber === currentIndex + 1 &&
      a.status === "booked"
  );

  if (missed && missed.id) {
    await db.collection("appointments").doc(missed.id).update({
      status: "waiting",
    });
  }

  // 3️⃣ Advance queue
  await queueRef.update({
    currentIndex: currentIndex + 1,
    updatedAt: Timestamp.now(),
  });

  // 4️⃣ Recalculate ETA
  await recalculateETAForQueue(queueId);

  res.json({ message: "Queue advanced" });
};

/**
 * ADD DELAY
 */
const addDelay = async (req, res) => {
  const { queueId, minutes } = req.body;

  await db.collection("queues").doc(queueId).update({
    delayMinutes: minutes,
    updatedAt: Timestamp.now(),
  });

  await recalculateETAForQueue(queueId);

  res.json({ message: "Delay updated" });
};

/**
 * END DAY
 */
const endDay = async (req, res) => {
  const { queueId } = req.body;

  const batch = db.batch();

  const apptSnap = await db
    .collection("appointments")
    .where("queueId", "==", queueId)
    .get();

  apptSnap.docs.forEach((doc) => batch.delete(doc.ref));

  batch.update(db.collection("queues").doc(queueId), {
    status: "closed",
    isOpen: false,
    closedAt: Timestamp.now(),
  });

  await batch.commit();

  res.json({ message: "OPD day closed" });
};

module.exports = {
  checkInPatient,
  sendNextPatient,
  addDelay,
  endDay,
};
