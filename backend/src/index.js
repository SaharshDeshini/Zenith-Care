const express = require("express");
const cors = require("cors");
const { db } = require("./config/firebase");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/firebase-test", async (req, res) => {
  try {
    await db.collection("test").doc("ping").set({
      time: new Date(),
      status: "connected",
    });
    res.send("Firebase connected successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const authRoutes = require("./routes/auth.routes");

app.use("/api/auth", authRoutes);
