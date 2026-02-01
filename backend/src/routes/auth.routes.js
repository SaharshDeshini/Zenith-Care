const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { getUserRole } = require("../controllers/auth.controller");

router.get("/role", verifyToken, getUserRole);

module.exports = router;
