// const express = require("express");
// const router = express.Router();

// const verifyToken = require("../middleware/verifyToken");
// const { initQueue, joinQueue, getQueueStatus } =
//   require("../controllers/queue.controller");

// router.post("/init", verifyToken, initQueue);
// router.post("/join", verifyToken, joinQueue);
// router.get("/:queueId/status", verifyToken, getQueueStatus);
// router.get("/today", verifyToken, getTodayQueue);


// module.exports = router;






const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
  initQueue,
  joinQueue,
  getQueueStatus,
  getTodayQueue,
} = require("../controllers/queue.controller");

router.post("/init", verifyToken, initQueue);
router.post("/join", verifyToken, joinQueue);
router.get("/today", verifyToken, getTodayQueue);
router.get("/:queueId/status", verifyToken, getQueueStatus);

module.exports = router;
