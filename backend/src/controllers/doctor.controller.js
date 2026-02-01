import { db } from "../config/firebase.js";

// Patient
export const getDoctorsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.query;
    if (!hospitalId) {
      return res.status(400).json({ message: "hospitalId required" });
    }

    const snapshot = await db
      .collection("doctors")
      .where("hospitalId", "==", hospitalId)
      .where("status", "==", "active")
      .get();

    const doctors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(doctors);
  } catch {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

// Reception
export const getDoctorsForReception = async (req, res) => {
  try {
    const uid = req.user.uid;

    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists || userDoc.data().role !== "reception") {
      return res.status(403).json({ message: "Access denied" });
    }

    const hospitalId = userDoc.data().hospitalId;

    const snapshot = await db
      .collection("doctors")
      .where("hospitalId", "==", hospitalId)
      .get();

    const doctors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(doctors);
  } catch {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};
