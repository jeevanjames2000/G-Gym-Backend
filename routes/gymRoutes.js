const express = require("express");
const router = express.Router();

const gymController = require("../controllers/gymController");
const gym_master_Controller = require("../controllers/gym_master_controller");

router.get("/getSlots", gymController.getSlots);
router.get("/getGymSchedule", gymController.getGymSchedule);
router.post("/insertGymSchedule", gymController.insertGymSchedule);
router.put("/updateGymSchedule/:id", gymController.updateGymSchedule);
router.post("/generateNewQr", gymController.generateQRCode);

// Master scheduling apis
router.get(
  "/getAllMasterSchedules",
  gym_master_Controller.getAllMasterSchedules
);
router.post(
  "/insertGymMasterScheduling",
  gym_master_Controller.insertGymMasterScheduling
);
router.get(
  "/getGymSchedulesByLocation/:locationId/:date",
  gym_master_Controller.getGymSchedulesByLocation
);

module.exports = router;
