const express = require("express");
const router = express.Router();

const gym_master_Controller = require("../controllers/gym_master_controller");
const authenticateJWT = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Gym Main Slots
 *   description: Homescreen slots
 */

/**
 * @swagger
 * /api/gym/getAllMasterSchedules:
 *   get:
 *     summary: Retrieve all master gym schedules
 *     tags: [Gym Main Slots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of master gym schedules
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
  "/getAllMasterSchedules",
  authenticateJWT,
  gym_master_Controller.getAllMasterSchedules
);

/**
 * @swagger
 *  /api/gym/getGymSchedulesByLocation/{date}/{locationId}:
 *   get:
 *     summary: Retrieve gym schedules by location and date
 *     tags: [Gym Main Slots]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date for which to retrieve gym schedules
 *       - in: path
 *         name: locationId
 *
 *         required: true
 *         description: The location ID for which to retrieve gym schedules
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of gym schedules for the specified date and location
 *         content:
 *           application/json:
 *
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/getGymSchedulesByLocation/:date/:locationId",
  authenticateJWT,
  gym_master_Controller.getGymSchedulesByLocation
);

// Master db data insert api
/**
 * @swagger
 *  /api/gym/insertGymMasterScheduling:
 *   post:
 *     summary: Insert a new gym master scheduling
 *     tags: [Gym Main Slots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GymMasterScheduling'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Gym master scheduling created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/insertGymMasterScheduling",
  authenticateJWT,
  gym_master_Controller.insertGymMasterScheduling
);

/**
 * @swagger
 * /api/gym/updateGymSchedule:
 *   post:
 *     summary: Update an existing gym schedule
 *     tags: [Gym Main Slots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GymScheduleUpdate'
 *     responses:
 *       200:
 *         description: Gym schedule updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post("/updateGymSchedule", gym_master_Controller.updateGymSchedule);

module.exports = router;
