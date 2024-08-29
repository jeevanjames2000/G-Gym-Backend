const express = require("express");
const router = express.Router();

const booking_slot_controller = require("../controllers/gym_booking_controller");
const authenticateJWT = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Gym Booking Slots
 *   description: API routes for managing gym booking slots
 */

/**
 * @swagger
 * /slot/gym/getGymSchedulesByLocationSQL/{locationId}/{date}:
 *   get:
 *     summary: Retrieve gym schedules by location and date
 *     tags: [Gym Booking Slots]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The location ID for which to retrieve gym schedules
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date for which to retrieve gym schedules
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of gym schedules for the specified date and location
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
  "/getGymSchedulesByLocationSQL/:locationId/:date",
  authenticateJWT,
  booking_slot_controller.getGymSchedulesByLocationSQL
);

/**
 * @swagger
 * /slot/gym/insertGymMasterSchedulingSQL:
 *   post:
 *     summary: Insert gym master scheduling details
 *     tags: [Gym Booking Slots]
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
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: The start date for the gym schedule
 *               start_time:
 *                 type: string
 *                 format: string
 *                 description: The start time for the gym schedule
 *               Gym_sheduling_id:
 *                 type: string
 *                 description: The gym scheduling ID
 *               end_time:
 *                 type: string
 *                 format: string
 *                 description: The end time for the gym schedule
 *               Location:
 *                 type: string
 *                 description: The location for the gym schedule
 *               campus:
 *                 type: string
 *                 description: The campus for the gym schedule
 *               masterID:
 *                 type: string
 *                 description: The master ID for the schedule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gym master scheduling details inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Gym master scheduling details inserted successfully"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /slot/gym/getAllHistory/:regdNo:
 *   get:
 *     summary: Retrieve gym schedules by location and date
 *     tags: [Gym Booking Slots]
 *     parameters:
 *       - in: path
 *         name: regdNo
 *         required: true
 *         schema:
 *           type: string
 *         description: The location ID for which to retrieve gym schedules
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of gym schedules for the specified regdNo
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
  "/getAllHistory/:regdNo",
  authenticateJWT,
  booking_slot_controller.getAllHistory
);

/**
 * @swagger
 * /slot/gym/getAdminSlots/{regdNo}/{start_time}:
 *   get:
 *     summary: Retrieve gym schedules by registration number and start time
 *     tags: [Gym Booking Slots]
 *     parameters:
 *       - in: path
 *         name: regdNo
 *         required: true
 *         schema:
 *           type: string
 *         description: The registration number for which to retrieve gym schedules
 *       - in: path
 *         name: start_time
 *         required: true
 *         schema:
 *           type: string
 *           format: time
 *         description: The start time for which to retrieve gym schedules
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of gym schedules for the specified registration number and start time
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
  "/getAdminSlots/:regdNo/:start_time",
  booking_slot_controller.getAdminSlots
);

module.exports = router;
