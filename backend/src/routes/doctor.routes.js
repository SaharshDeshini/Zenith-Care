const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
  getDoctorsByHospital,
  getDoctorsForReception,
} = require("../controllers/doctor.controller");

router.get("/", verifyToken, getDoctorsByHospital);
router.get("/reception", verifyToken, getDoctorsForReception);

module.exports = router;
