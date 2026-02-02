const { db } = require("../config/firebase");
const { Timestamp } = require("firebase-admin/firestore");
const { calculateETA } = require("./eta");

const recalculateETAForQueue = async (queueId) => {
  const queueSnap = await db.collection("queues").doc(queueId).get();
  if (!queueSnap.exists) return;

  const queue = queueSnap.data();

  const doctorSnap = await db
    .collection("doctors")
    .doc(queue.doctorId)
    .get();

  if (!doctorSnap.exists) return;

  const avgConsultTime = doctorSnap.data().avgConsultTime;
  const delayMinutes = queue.delayMinutes || 0;

  const apptSnap = await db
    .collection("appointments")
    .where("queueId", "==", queueId)
    .orderBy("queueNumber")
    .get();

  const now = new Date();

  const batch = db.batch();

  apptSnap.docs.forEach((doc) => {
    const appt = doc.data();

    if (
      appt.status === "completed" ||
      appt.status === "waiting"
    ) {
      return;
    }

    const peopleAhead =
      appt.queueNumber - queue.currentIndex - 1;

    const etaDate = calculateETA({
      baseTime: now,
      peopleAhead,
      avgConsultTime,
      delayMinutes,
    });

    batch.update(doc.ref, {
      eta: Timestamp.fromDate(etaDate),
      updatedAt: Timestamp.now(),
    });
  });

  await batch.commit();
};

module.exports = { recalculateETAForQueue };
