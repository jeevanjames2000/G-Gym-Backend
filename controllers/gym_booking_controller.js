const sql = require("mssql");
const Gym_Master = require("../models/gym_Master");

const convertTime = (time) => {
  let [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
  const originalTime = `${hours}:${minutes} ${period}`;
  if (period === "PM" && hours !== "12") hours = parseInt(hours, 10) + 12;
  if (period === "AM" && hours === "12") hours = "00";
  return { formattedTime: `${hours}:${minutes}:00`, originalTime };
};
module.exports = {
  insertGymMasterScheduling: async function (req, res) {
    try {
      const {
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
        occupied,
        campus,
      } = req.body;
      const getGymSchedulingId = (time) => {
        switch (time) {
          case "6:00 AM":
            return "V1";
          case "7:00 AM":
            return "V2";
          case "8:00 AM":
            return "V3";
          case "3:00 PM":
            return "V4";
          case "4:00 PM":
            return "V5";
          case "5:00 PM":
            return "V6";
          case "6:00 PM":
            return "V7";
          case "7:00 PM":
            return "V8";
          case "8:00 PM":
            return "V9";
          case "12:00 PM":
            return "V10";
          case "2:00 PM":
            return "V11";
          default:
            return null;
        }
      };
      const {
        formattedTime: formattedStartTime,
        originalTime: originalStartTime,
      } = convertTime(start_time);
      const { formattedTime: formattedEndTime, originalTime: originalEndTime } =
        convertTime(end_time);
      const {
        formattedTime: formattedGeneratedTime,
        originalTime: originalGeneratedTime,
      } = convertTime(generated_time);
      const Gym_sheduling_id = getGymSchedulingId(originalStartTime);
      const pool = req.app.locals.sql;
      await pool
        .request()
        .input("Gym_sheduling_id", sql.VarChar, Gym_sheduling_id)
        .input("start_date", sql.Date, start_date)
        .input("start_time", sql.VarChar, originalStartTime)
        .input("end_time", sql.VarChar, originalEndTime)
        .input("end_date", sql.Date, end_date)
        .input("generated_date", sql.Date, generated_date)
        .input("max_count", sql.Int, max_count)
        .input("generated_by", sql.VarChar, generated_by)
        .input("status", sql.VarChar, status)
        .input("generated_time", sql.VarChar, originalGeneratedTime)
        .input("Access_type", sql.VarChar, Access_type)
        .input("Location", sql.VarChar, Location)
        .input("occupied", sql.Int, occupied)
        .input("campus", sql.VarChar, campus).query(`
          INSERT INTO GYM_SCHEDULING_MASTER (
            Gym_sheduling_id, start_date, start_time, end_time, end_date,
            generated_date, max_count, generated_by, status, generated_time,
            Access_type, Location,  occupied, campus
          )
          VALUES (
            @Gym_sheduling_id, @start_date, @start_time, @end_time, @end_date,
            @generated_date, @max_count, @generated_by, @status, @generated_time,
            @Access_type, @Location, @occupied, @campus
          )
        `);
      res
        .status(201)
        .json({ message: "Gym scheduling record created successfully" });
    } catch (err) {
      console.error("Error inserting gym scheduling record:", err);
      res.status(500).json({ error: "Failed to insert gym scheduling record" });
    }
  },

  getGymSchedulesByLocation: async function (req, res) {
    const locationId = req.params.locationId;
    const date = req.params.date;
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

      const data = result.recordset;
      const filteredData = data.map((item) => ({
        start_date: item.start_date,
        start_time: item.start_time,
        end_time: item.end_time,
        location: item.Location,
        available: item.max_count - item.occupied,
        occupied: item.occupied,
      }));
      res.status(200).json({ fullData: data, filteredData: filteredData });
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
      // Query to fetch the records
      const result = await Gym_Master.find({
        Location: locationId,
        start_date: date,
      });

      if (result.length === 0) {
        return res.status(404).json({
          message: "No gym schedules found for the specified location and date",
        });
      }

      const data = result;
      const filteredData = data.map((item) => ({
        start_date: item.start_date,
        start_time: item.start_time,
        end_time: item.end_time,
        location: item.Location,
        available: item.max_count - item.occupied,
        occupied: item.occupied,
      }));

      res.status(200).json({ fullData: data, filteredData: filteredData });
    } catch (err) {
      console.error(
        "Error fetching gym schedules by location ID and date:",
        err
      );
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },
  insertGymMasterSchedulingMongo: async function (req, res) {
    try {
      const {
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
        occupied,
        campus,
      } = req.body;

      const getGymSchedulingId = (time) => {
        switch (time) {
          case "6:00 AM":
            return "V1";
          case "7:00 AM":
            return "V2";
          case "8:00 AM":
            return "V3";
          case "3:00 PM":
            return "V4";
          case "4:00 PM":
            return "V5";
          case "5:00 PM":
            return "V6";
          case "6:00 PM":
            return "V7";
          case "7:00 PM":
            return "V8";
          case "8:00 PM":
            return "V9";
          case "12:00 PM":
            return "V10";
          case "2:00 PM":
            return "V11";
          default:
            return null;
        }
      };

      const convertTime = (time) => {
        let [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
        const originalTime = `${hours}:${minutes} ${period}`;
        if (period === "PM" && hours !== "12") hours = parseInt(hours, 10) + 12;
        if (period === "AM" && hours === "12") hours = "00";
        return { formattedTime: `${hours}:${minutes}:00`, originalTime };
      };

      const {
        formattedTime: formattedStartTime,
        originalTime: originalStartTime,
      } = convertTime(start_time);

      const { formattedTime: formattedEndTime, originalTime: originalEndTime } =
        convertTime(end_time);
      const {
        formattedTime: formattedGeneratedTime,
        originalTime: originalGeneratedTime,
      } = convertTime(generated_time);

      const Gym_sheduling_id = getGymSchedulingId(originalStartTime);

      const newSchedule = new Gym_Master({
        Gym_scheduling_id: Gym_sheduling_id,
        start_date,
        start_time: originalStartTime,
        end_time: originalEndTime,
        end_date,
        generated_date,
        max_count,
        generated_by,
        status,
        generated_time: originalGeneratedTime,
        Access_type,
        Location,
        occupied,
        campus,
      });

      await newSchedule.save();

      res
        .status(201)
        .json({ message: "Gym scheduling record created successfully" });
    } catch (err) {
      console.error("Error inserting gym scheduling record:", err);
      res.status(500).json({ error: "Failed to insert gym scheduling record" });
    }
  },
};
