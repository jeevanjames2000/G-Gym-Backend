const express = require("express");
const router = express.Router();

const booking_slot_controller = require("../controllers/gym_booking_controller");

// Slot Booking Routes
// router.get(
//   "/getGymSchedulesByLocation/:locationId/:date",
//   booking_slot_controller.getGymSchedulesByLocation
// );
// router.post(
//   "/insertGymMasterScheduling",
//   booking_slot_controller.insertGymMasterScheduling
// );

router.get(
  "/getGymSchedulesByLocationMongo/:locationId/:date",
  booking_slot_controller.getGymSchedulesByLocationMongo
);

router.post(
  "/insertGymMasterSchedulingMongo",
  booking_slot_controller.insertGymMasterSchedulingMongo
);
router.get(
  "/getGymBookingsByRegdNo/:regdNo",
  booking_slot_controller.getGymBookingsByRegdNo
);

module.exports = router;
