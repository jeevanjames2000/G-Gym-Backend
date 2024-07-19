const sql = require("mssql");

const formatDate = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
module.exports = {
  // SQL Syntax
  getAllMasterSchedules: async (req, res) => {
    try {
      const pool = req.app.locals.sql;
      const result = await pool
        .request()
        .query("select * from GYM_SCHEDULING_MASTER");
      res.status(200).json(result);
    } catch (err) {
      console.error("Error fetching gym schedules:", err);
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },

  getGymSchedulesByLocation: async (req, res) => {
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
      res.status(200).json(result.recordset);
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
      Gym_sheduling_id,
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
      const generated_time = currentDate;

      const query = `
      INSERT INTO GYM_SCHEDULING_MASTER (
        Gym_sheduling_id,
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
        campus
      )
      VALUES (
        @Gym_sheduling_id,
        @start_date,
        @start_time,
        @end_time,
        @end_date,
        @generated_date,
        @max_count,
        @generated_by,
        @status,
        @generated_time,
        @Access_type,
        @Location,
        @available,
        @occupied,
        @campus
      )
    `;

      const request = new sql.Request();

      request.input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id);
      request.input("start_date", sql.Date, start_date);
      request.input("start_time", sql.VarChar(10), start_time);
      request.input("end_time", sql.VarChar(10), end_time);
      request.input("end_date", sql.Date, end_date);
      request.input("generated_date", sql.Date, generated_date);
      request.input("max_count", sql.Int, max_count);
      request.input("generated_by", sql.VarChar(100), generated_by);
      request.input("status", sql.VarChar(15), status);
      request.input("generated_time", sql.DateTime, generated_time);
      request.input("Access_type", sql.VarChar(10), Access_type);
      request.input("Location", sql.VarChar(20), Location);
      request.input("available", sql.Int, available);
      request.input("occupied", sql.Int, occupied);
      request.input("campus", sql.VarChar(10), campus);

      await request.query(query);

      res.status(201).send("Gym scheduling record created successfully");
    } catch (error) {
      console.error("Error inserting gym scheduling record:", error);
      res.status(500).send("Error inserting gym scheduling record");
    }
  },

  // SQL Syntax
};
