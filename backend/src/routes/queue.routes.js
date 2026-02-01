const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { initQueue, joinQueue, getQueueStatus } =
  require("../controllers/queue.controller");

router.post("/init", verifyToken, initQueue);
router.post("/join", verifyToken, joinQueue);
router.get("/:queueId/status", verifyToken, getQueueStatus);

module.exports = router;
