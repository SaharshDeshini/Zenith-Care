const { db } = require("../config/firebase");
const { Timestamp } = require("firebase-admin/firestore");
const { getTodayDate } = require("../utils/date");
const { recalculateETAForQueue } = require("../utils/recalculateEta");

/**
 * INIT QUEUE (Reception Only)
 */
const initQueue = async (req, res) => {
  try {
    const { doctorId } = req.body;

    // Fetch doctor to get hospitalId (SOURCE OF TRUTH)
    const doctorDoc = await db
      .collection("doctors")
      .doc(doctorId)
      .get();

    if (!doctorDoc.exists) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const hospitalId = doctorDoc.data().hospitalId;

    if (!hospitalId) {
      return res.status(400).json({ error: "Doctor has no hospitalId" });
    }

    const today = getTodayDate();

    const existing = await db
      .collection("queues")
      .where("doctorId", "==", doctorId)
      .where("date", "==", today)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ error: "Queue already exists" });
    }

    const queueRef = await db.collection("queues").add({
      doctorId,
      hospitalId,
      date: today,
      status: "active",
      currentIndex: 0,
      delayMinutes: 0,
      isOpen: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return res.status(201).json({
      message: "Queue initialized",
      queueId: queueRef.id,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * JOIN QUEUE (Patient / Reception)
 */
const joinQueue = async (req, res) => {
  const { queueId, patientName } = req.body;
  const user = req.user;

  try {
    // Fetch role from users collection
    const userDoc = await db
      .collection("users")
      .doc(user.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(400).json({ error: "User not found" });
    }

    const role = userDoc.data().role;

    const queueRef = db.collection("queues").doc(queueId);
    const appointmentsRef = db.collection("appointments");

    await db.runTransaction(async (tx) => {
      const queueSnap = await tx.get(queueRef);
      if (!queueSnap.exists) throw new Error("Queue not found");

      if (queueSnap.data().status !== "active")
        throw new Error("Queue not active");

      const lastSnap = await tx.get(
        appointmentsRef
          .where("queueId", "==", queueId)
          .orderBy("queueNumber", "desc")
          .limit(1)
      );

      const lastNumber = lastSnap.empty
        ? 0
        : lastSnap.docs[0].data().queueNumber;

      const appointmentRef = appointmentsRef.doc();

      tx.set(appointmentRef, {
        queueId,
        doctorId: queueSnap.data().doctorId,
        hospitalId: queueSnap.data().hospitalId,

        patientId: role === "patient" ? user.uid : null,
        patientName,

        source: role === "patient" ? "online" : "reception",
        queueNumber: lastNumber + 1,

        status: "booked",
        scheduledDate: queueSnap.data().date,

        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    });

    // ✅ ETA recalculated AFTER booking
    await recalculateETAForQueue(queueId);

    return res.status(201).json({ message: "Joined queue successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * QUEUE STATUS (PATIENT VIEW)
 */
const getQueueStatus = async (req, res) => {
  const { queueId } = req.params;
  const user = req.user;

  try {
    const queueSnap = await db.collection("queues").doc(queueId).get();
    if (!queueSnap.exists)
      return res.status(404).json({ error: "Queue not found" });

    const appointmentsSnap = await db
      .collection("appointments")
      .where("queueId", "==", queueId)
      .orderBy("queueNumber")
      .get();

    const appointments = appointmentsSnap.docs.map((d) => d.data());
    const myAppt = appointments.find(
      (a) => a.patientId === user.uid
    );

    return res.json({
      status: queueSnap.data().status,
      currentServing: queueSnap.data().currentIndex,
      yourQueueNumber: myAppt?.queueNumber ?? null,
      peopleAhead: myAppt
        ? myAppt.queueNumber -
          queueSnap.data().currentIndex -
          1
        : null,
      eta: myAppt?.eta ?? null,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  initQueue,
  joinQueue,
  getQueueStatus,
};
