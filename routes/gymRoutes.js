const express = require("express");
const router = express.Router();

const gym_master_Controller = require("../controllers/gym_master_controller");
const authenticateJWT = require("../middleware/auth");

router.get(
  "/getAllMasterSchedules",
  authenticateJWT,
  gym_master_Controller.getAllMasterSchedules
);

router.get(
  "/getGymSchedulesByLocation/:date/:locationId",
  authenticateJWT,
  gym_master_Controller.getGymSchedulesByLocation
);

// Master db data insert api
router.post(
  "/insertGymMasterScheduling",
  authenticateJWT,
  gym_master_Controller.insertGymMasterScheduling
);

module.exports = router;
