const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
  pauseQueue,
  resumeQueue,
} = require("../controllers/phase4.controller");

router.post("/pause/:queueId", verifyToken, pauseQueue);
router.post("/resume/:queueId", verifyToken, resumeQueue);

module.exports = router;
