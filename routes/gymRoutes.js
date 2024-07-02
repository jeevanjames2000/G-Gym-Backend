const express = require("express");
const router = express.Router();

const gymController = require("../controllers/gymController");

router.get("/getSlots", gymController.getSlots);
router.get("/getGymSchedule", gymController.getGymSchedule);
router.post("/insertGymSchedule", gymController.insertGymSchedule);
router.put("/updateGymSchedule/:id", gymController.updateGymSchedule);
router.post("/generateNewQr", gymController.generateQRCode);

module.exports = router;
