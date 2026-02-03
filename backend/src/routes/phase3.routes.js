const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
  checkInPatient,
  sendNextPatient,
  addDelay,
  endDay,
} = require("../controllers/phase3.controller");

router.post("/check-in", verifyToken, checkInPatient);
router.post("/send-next/:queueId", verifyToken, sendNextPatient);
router.post("/delay", verifyToken, addDelay);
router.post("/end-day", verifyToken, endDay);

module.exports = router;
