const express = require("express");
const router = express.Router();

const gymController = require("../controllers/gymController");
const gym_master_Controller = require("../controllers/gym_master_controller");
const booking_slot_controller = require("../controllers/gym_booking_controller");

router.get("/getSlots", gymController.getSlots);
router.get("/getGymSchedule", gymController.getGymSchedule);
router.post("/insertGymSchedule", gymController.insertGymSchedule);
router.put("/updateGymSchedule/:id", gymController.updateGymSchedule);
router.post("/generateNewQr", gymController.generateQRCode);

// Slot Booking Routes
router.post(
  "/insertGymMasterScheduling",
  booking_slot_controller.insertGymMasterScheduling
);
// router.get(
//   "/getGymSchedulesByLocation/:locationId/:date",
//   booking_slot_controller.getGymSchedulesByLocation
// );

// Master scheduling apis
router.get(
  "/getAllMasterSchedules",
  gym_master_Controller.getAllMasterSchedules
);
// router.post(
//   "/insertGymMasterScheduling",
//   gym_master_Controller.insertGymMasterScheduling
// );
router.get(
  "/getGymSchedulesByLocation/:locationId/:date",
  gym_master_Controller.getGymSchedulesByLocation
);
router.post(
  "/updateGymMasterScheduling",
  gym_master_Controller.updateGymMasterScheduling
); 

module.exports = router;
