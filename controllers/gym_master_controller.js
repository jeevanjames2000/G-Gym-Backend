const Gym_master = require("../models/gym_Master");
module.exports = {
  insertGymMasterScheduling: async function (req, res) {
    try {
      const {
        Gym_scheduling_id,
        start_date,
        start_time,
        end_time,
        end_date,
        generated_date,
        max_count,
        generated_by,
        status,
        generated_time,
        Access_type,
        Location,
        ID,
        occupied,
        campus,
      } = req.body;

      const formattedStartDate = new Date(start_date).toLocaleDateString(
        "en-CA"
      ); // YYYY-MM-DD format
      const formattedEndDate = new Date(end_date).toLocaleDateString("en-CA");
      const formattedGeneratedDate = new Date(
        generated_date
      ).toLocaleDateString("en-CA");

      const newGymSchedule = new Gym_master({
        Gym_scheduling_id,
        start_date,
        start_time,
        end_time,
        end_date,
        generated_date,
        max_count,
        generated_by,
        status,
        generated_time,
        Access_type,
        Location,
        ID,
        occupied,
        campus,
      });
      await newGymSchedule.save();
      res
        .status(201)
        .json({ message: "Gym scheduling record created successfully" });
    } catch (err) {
      console.error("Error inserting gym scheduling record:", err);
      res.status(500).json({ error: "Failed to insert gym scheduling record" });
    }
  },
  getAllMasterSchedules: async function (req, res) {
    try {
      const gymSchedules = await Gym_master.find();
      res.status(200).json(gymSchedules);
    } catch (err) {
      console.error("Error fetching gym schedules:", err);
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },
  getGymSchedulesByLocation: async function (req, res) {
    const locationId = req.params.locationId;
    const date = new Date(req.params.date);

    try {
      const gymSchedules = await Gym_master.find({
        Location: locationId,
        start_date: date,
      });

      if (gymSchedules.length === 0) {
        return res.status(404).json({
          message: "No gym schedules found for the specified location and date",
        });
      }

      res.status(200).json(gymSchedules);
    } catch (err) {
      console.error(
        "Error fetching gym schedules by location ID and date:",
        err
      );
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },
};
