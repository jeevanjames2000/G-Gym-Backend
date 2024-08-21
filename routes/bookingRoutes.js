const express = require("express");
const router = express.Router();

const booking_slot_controller = require("../controllers/gym_booking_controller");
const authenticateJWT = require("../middleware/auth");
// Slot Booking Routes
router.get(
  "/getGymSchedulesByLocationSQL/:locationId/:date",
  authenticateJWT,
  booking_slot_controller.getGymSchedulesByLocationSQL
);
router.post(
  "/insertGymMasterSchedulingSQL",
  authenticateJWT,
  booking_slot_controller.insertGymMasterSchedulingSQL
);

router.get(
  "/getGymBookingsByRegdNo/:regdNo",
  authenticateJWT,
  booking_slot_controller.getGymBookingsByRegdNo
);
router.delete(
  "/deleteGymBookingsByRegdNo",
  authenticateJWT,
  booking_slot_controller.deleteGymBookingsByRegdNo
);

// history get api route

router.get(
  "/getAllHistory/:regdNo",
  authenticateJWT,
  booking_slot_controller.getAllHistory
);
router.get(
  "/getAdminSlots/:regdNo/:start_time",
  booking_slot_controller.getAdminSlots
);
module.exports = router;
