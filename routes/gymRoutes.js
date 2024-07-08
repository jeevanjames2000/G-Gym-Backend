const express = require("express");
const router = express.Router();

const gym_master_Controller = require("../controllers/gym_master_controller");

router.get("/getGymSchedule", gym_master_Controller.getGymSchedule);

// router.get(
//   "/getAllMasterSchedules",
//   gym_master_Controller.getAllMasterSchedules
// );

// router.get(
//   "/getGymSchedulesByLocation/:locationId/:date",
//   gym_master_Controller.getGymSchedulesByLocation
// );

router.get(
  "/getGymSchedulesByLocationMongo/:locationId/:date",
  gym_master_Controller.getGymSchedulesByLocationMongo
);

// Master db data insert api
router.post(
  "/insertGymMasterScheduling",
  gym_master_Controller.insertGymMasterScheduling
);

module.exports = router;
