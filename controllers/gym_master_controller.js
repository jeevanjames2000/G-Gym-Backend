const sql = require("mssql");
const qr = require("qrcode");
const Gym_Master = require("../models/gym_Master");
const convertTime = (time) => {
  let [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
  const originalTime = `${hours}:${minutes} ${period}`;
  if (period === "PM" && hours !== "12") hours = parseInt(hours, 10) + 12;
  if (period === "AM" && hours === "12") hours = "00";
  return { formattedTime: `${hours}:${minutes}:00`, originalTime };
};
const generateQRCode = async (data) => {
  try {
    const qrCodeDataUri = await qr.toDataURL(JSON.stringify(data));
    return qrCodeDataUri;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Error generating QR code");
  }
};
const formatTime = (date) => {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};
const formatDate = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
module.exports = {
  getGymSchedule: async (req, res) => {
    try {
      const gymSchedules = await Gym_Master.find();
      res.status(200).json(gymSchedules);
    } catch (error) {
      console.error("Error fetching gym schedules:", error);
      res.status(500).json({ message: "Error fetching gym schedules" });
    }
  },
  getAllMasterSchedules: async function (req, res) {
    try {
      const pool = req.app.locals.sql;
      const result = await pool
        .request()
        .query("SELECT * FROM GYM_SCHEDULING_MASTER");
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error("Error fetching gym schedules:", err);
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },
  getGymSchedulesByLocation: async function (req, res) {
    const locationId = req.params.locationId;
    console.log("locationId: ", locationId);
    const date = req.params.date;
    console.log("date: ", date);
    try {
      const pool = req.app.locals.sql;
      const result = await pool
        .request()
        .input("Location", sql.VarChar, locationId)
        .input("Date", sql.Date, date)
        .query(
          "SELECT * FROM GYM_SCHEDULING_MASTER WHERE Location = @Location AND start_date = @Date"
        );
      if (result.recordset.length === 0) {
        return res.status(404).json({
          message: "No gym schedules found for the specified location and date",
        });
      }
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error(
        "Error fetching gym schedules by location ID and date:",
        err
      );
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },
  getGymSchedulesByLocationMongo: async function (req, res) {
    const locationId = req.params.locationId;
    const date = new Date(req.params.date);
    try {
      const endDate = new Date(date);
      endDate.setDate(date.getDate() + 1);
      const result = await Gym_Master.find({
        Location: locationId,
        start_date: { $gte: date, $lt: endDate },
      });
      if (result.length === 0) {
        return res.status(404).json({
          message: "No gym schedules found for the specified location and date",
        });
      }
      const filteredData = result.map((item) => ({
        start_date: item.start_date.toISOString().split("T")[0],
        start_time: item.start_time,
        end_time: item.end_time,
        location: item.Location,
        available: item.max_count - item.occupied,
        occupied: item.occupied,
      }));
      res.status(200).json({ fullData: result, filteredData: filteredData });
    } catch (err) {
      console.error(
        "Error fetching gym schedules by location ID and date:",
        err
      );
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },
  insertGymMasterScheduling: async function (req, res) {
    const {
      Gym_scheduling_id,
      start_date,
      start_time,
      end_time,
      end_date,
      max_count,
      generated_by,
      status,
      Access_type,
      Location,
      available,
      occupied,
      campus,
    } = req.body;
    try {
      const currentDate = new Date();
      const generated_date = formatDate(currentDate);
      const generated_time = formatTime(currentDate);
      const newGymScheduling = new Gym_Master({
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
        available,
        occupied,
        campus,
      });
      await newGymScheduling.save();
      res.status(201).send("Gym scheduling record created successfully");
    } catch (error) {
      console.error("Error inserting gym scheduling record:", error);
      res.status(500).send("Error inserting gym scheduling record");
    }
  },
};
