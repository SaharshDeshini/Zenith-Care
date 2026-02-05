import { db } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

export const getUserRole = async (req, res) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email || null;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    // 🔹 CASE 1: User already exists
    if (userDoc.exists) {
      const role = userDoc.data().role || "patient";
      return res.json({ role });
    }

    // 🔹 CASE 2: User does NOT exist → AUTO-CREATE (PATIENT)
    await userRef.set({
      role: "patient",
      email,
      createdAt: Timestamp.now(),
    });

    return res.json({ role: "patient" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to determine role" });
  }
};
