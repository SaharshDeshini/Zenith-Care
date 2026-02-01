import { db } from "../config/firebase.js";

export const getUserRole = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();

    if (userDoc.exists && userDoc.data().role === "reception") {
      return res.json({ role: "reception" });
    }

    return res.json({ role: "patient" });
  } catch {
    return res.status(500).json({ message: "Failed to determine role" });
  }
};
