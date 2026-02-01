const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { getHospitals } = require("../controllers/hospital.controller");

router.get("/", verifyToken, getHospitals);

module.exports = router;
