const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { getUserRole } = require("../controllers/auth.controller");

router.get("/role", authMiddleware, getUserRole);

module.exports = router;
