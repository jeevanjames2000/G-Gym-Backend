const express = require("express");
const router = express.Router();

const booking_slot_controller = require("../controllers/gym_booking_controller");

// Slot Booking Routes
router.get(
  "/getGymSchedulesByLocationSQL/:locationId/:date",
  booking_slot_controller.getGymSchedulesByLocationSQL
);
router.post(
  "/insertGymMasterSchedulingSQL",
  booking_slot_controller.insertGymMasterSchedulingSQL
);

router.get(
  "/getGymBookingsByRegdNo/:regdNo",
  booking_slot_controller.getGymBookingsByRegdNo
);
router.delete(
  "/deleteGymBookingsByRegdNo/:regdNo",
  booking_slot_controller.deleteGymBookingsByRegdNo
);

module.exports = router;
