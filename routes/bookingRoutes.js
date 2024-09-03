const express = require("express");
const router = express.Router();

const booking_slot_controller = require("../controllers/gym_booking_controller");
const authenticateJWT = require("../middleware/auth");

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

/**
 * @swagger
 * /slot/gym/getGymBookingsByRegdNo/{regdNo}:
 *   get:
 *     summary: Retrieve gym bookings by registration number
 *     tags: [Gym Booking Slots]
 *     parameters:
 *       - in: path
 *         name: regdNo
 *         schema:
 *           type: string
 *         required: true
 *         description: The registration number for the gym member
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of gym bookings for the specified registration number
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MasterSchedule'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/getGymBookingsByRegdNo/:regdNo",
  authenticateJWT,
  booking_slot_controller.getGymBookingsByRegdNo
);

/**
 * @swagger
 * /slot/gym/deleteGymBookingsByRegdNo:
 *   delete:
 *     summary: Delete gym bookings by registration number
 *     tags: [Gym Booking Slots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               regdNo:
 *                 type: string
 *                 description: The registration number for the gym member
 *               masterID:
 *                 type: string
 *                 description: The ID of the master schedule
 *               message:
 *                 type: string
 *                 description: A message associated with the deletion request
 *               status:
 *                 type: string
 *                 description: The status of the booking (e.g., 'Cancelled', 'Deleted')
 *     responses:
 *       200:
 *         description: Gym bookings deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/deleteGymBookingsByRegdNo",
  authenticateJWT,
  booking_slot_controller.deleteGymBookingsByRegdNo
);

router.get(
  "/getAllHistory/:regdNo",
  authenticateJWT,
  booking_slot_controller.getAllHistory
);

router.get(
  "/getAdminSlots/:regdNo/:start_time/:start_date",
  booking_slot_controller.getAdminSlots
);

module.exports = router;
