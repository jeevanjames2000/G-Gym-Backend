const sql = require("mssql");
const convertTime = (time) => {
  let [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
  const originalTime = `${hours}:${minutes} ${period}`;
  if (period === "PM" && hours !== "12") hours = parseInt(hours, 10) + 12;
  if (period === "AM" && hours === "12") hours = "00";
  return { formattedTime: `${hours}:${minutes}:00`, originalTime };
};
module.exports = {
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
  updateGymMasterScheduling: async function (req, res) {
    try {
      const { start_date, start_time, Location } = req.body;
      const pool = req.app.locals.sql;
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
      const { originalTime: originalStartTime } = convertTime(start_time);
      console.log("originalStartTime: ", originalStartTime);
      const Gym_sheduling_id = getGymSchedulingId(originalStartTime);
      console.log("Gym_sheduling_id: ", Gym_sheduling_id);
      const { recordset } = await pool
        .request()
        .input("Location", sql.VarChar, Location)
        .input("start_time", sql.VarChar, originalStartTime)
        .input("start_date", sql.Date, start_date).query(`
        SELECT occupied, max_count
        FROM GYM_SCHEDULING_MASTER
        WHERE Location = @Location
        AND start_time = @start_time
        AND start_date = @start_date
      `);
      if (recordset.length === 0) {
        return res
          .status(404)
          .json({ error: "Gym scheduling record not found" });
      }
      const { occupied, max_count } = recordset[0];
      const newOccupied = occupied + 1;
      if (newOccupied > max_count) {
        return res
          .status(400)
          .json({ error: "Max occupied slots reached (45)" });
      }
      await pool
        .request()
        .input("Location", sql.VarChar, Location)
        .input("start_time", sql.VarChar, originalStartTime)
        .input("newOccupied", sql.Int, newOccupied)
        .input("start_date", sql.Date, start_date).query(`
        UPDATE GYM_SCHEDULING_MASTER
        SET occupied = @newOccupied
        WHERE Location = @Location
        AND start_time = @start_time
        AND start_date = @start_date
      `);
      res
        .status(200)
        .json({ message: "Gym scheduling record updated successfully" });
    } catch (err) {
      console.error("Error updating gym scheduling record:", err);
      res.status(500).json({ error: "Failed to update gym scheduling record" });
    }
  },
};
