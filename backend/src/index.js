const express = require("express");
const cors = require("cors");

const hospitalRoutes = require("./routes/hospital.routes");
const doctorRoutes = require("./routes/doctor.routes");
const authRoutes = require("./routes/auth.routes");
const queueRoutes = require("./routes/queue.routes");
const phase3Routes = require ("./routes/phase3.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/phase3", phase3Routes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
