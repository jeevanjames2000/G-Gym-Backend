const Gym = require("../models/Gym");
const qr = require("qrcode");
const generateQRCode = async (data) => {
  try {
    const qrCodeDataUri = await qr.toDataURL(JSON.stringify(data));
    return qrCodeDataUri;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Error generating QR code");
  }
};
module.exports = {
  insertGymSchedule: async (req, res) => {
    try {
      const { empID, studentID, date, location, timeslot } = req.body;
      let gymSchedule = await Gym.findOne({ date, location, timeslot });
      if (gymSchedule) {
        if (gymSchedule.availableSlots > 0) {
          gymSchedule.availableSlots -= 1;
          gymSchedule.occupiedSlots += 1;
          gymSchedule.barcode = await generateQRCode(gymSchedule);
          const updatedGymSchedule = await gymSchedule.save();
          return res.status(201).json(updatedGymSchedule);
        } else {
          return res.status(400).json({ message: "No available slots" });
        }
      } else {
        const newGymSchedule = new Gym({
          empID,
          studentID,
          date,
          location,
          timeslot,
          booked: false,
          totalSlots: 45,
          availableSlots: 44,
          occupiedSlots: 1,
        });
        newGymSchedule.barcode = await generateQRCode(newGymSchedule);
        const savedGymSchedule = await newGymSchedule.save();
        res.status(201).json(savedGymSchedule);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
  getGymSchedule: async (req, res) => {
    try {
      const gymSchedules = await Gym.find();
      res.status(200).json(gymSchedules);
    } catch (error) {
      console.error("Error fetching gym schedules:", error);
      res.status(500).json({ message: "Error fetching gym schedules" });
    }
  },
  updateGymSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const { empID, studentID, date, location, timeslot, booked } = req.body;
      const updatedGymSchedule = await Gym.findByIdAndUpdate(
        id,
        {
          empID,
          studentID,
          date,
          location,
          timeslot,
          booked,
        },
        { new: true }
      );
      if (!updatedGymSchedule) {
        return res.status(404).json({ message: "Gym schedule not found" });
      }
      res.status(200).json(updatedGymSchedule);
    } catch (error) {
      console.error("Error updating gym schedule:", error);
      res.status(500).json({ message: "Error updating gym schedule" });
    }
  },
  getSlots: async (req, res) => {
    try {
      const gymSchedules = await Gym.find();
      const slotsInfo = gymSchedules.map((schedule) => ({
        availableSlots: schedule.availableSlots,
        occupiedSlots: schedule.occupiedSlots,
      }));
      res.status(200).json(slotsInfo);
    } catch (error) {
      console.error("Error fetching gym schedules:", error);
      res.status(500).json({ message: "Error fetching gym schedules" });
    }
  },
  generateQRCode: generateQRCode,
};
