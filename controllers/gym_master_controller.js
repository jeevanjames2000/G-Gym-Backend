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
          "SELECT * FROM GYM_SCHEDULING_MASTER WHERE Location = @Location AND start_date = @Date ORDER BY ID ASC"
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

  updateGymSchedule: async (req, res) => {
    const pool = req.app.locals.sql;
    const transaction = new sql.Transaction(pool);

    try {
      const { regdNo, start_time, start_date, id, masterID } = req.body;

      if (!regdNo || !start_time || !start_date || !id || !masterID) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      await transaction.begin();

      const updateQuery = `
      UPDATE GYM_SLOT_DETAILS
      SET attendance = 'P'
      WHERE id = @id AND regdNo = @regdNo AND start_time = @start_time;
    `;

      const updateResult = await transaction
        .request()
        .input("regdNo", sql.VarChar(10), regdNo)
        .input("start_time", sql.VarChar(100), start_time)
        .input("start_date", sql.Date, start_date)
        .input("id", sql.Int, id)
        .query(updateQuery);

      const updateHistoryQuery = `
      UPDATE GYM_SLOT_DETAILS_HISTORY
      SET attendance = 'P',status='booked'
      WHERE masterID = @masterID AND regdNo = @regdNo AND start_time = @start_time;
    `;

      await transaction
        .request()
        .input("regdNo", sql.VarChar(10), regdNo)
        .input("start_time", sql.VarChar(100), start_time)
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .query(updateHistoryQuery);

      await transaction
        .request()
        .input("masterID", sql.VarChar(sql.MAX), masterID).query(`
            UPDATE GYM_SCHEDULING_MASTER
            SET available = available + 1, occupied = occupied - 1
            WHERE ID = @masterID
          `);

      if (updateResult.rowsAffected[0] === 0) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: "No matching record found to update" });
      }

      const deleteQuery = `
      DELETE FROM GYM_SLOT_DETAILS
      WHERE regdNo = @regdNo AND masterID = @masterID
    `;

      await transaction
        .request()
        .input("regdNo", sql.VarChar(10), regdNo)
        .input("masterID", sql.VarChar(50), masterID)
        .query(deleteQuery);

      await transaction.commit();
      res.status(200).json({
        message: "Gym schedule updated and slot deleted successfully",
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating gym schedule:", error);
      res.status(500).json({ message: "Error updating gym slot attendance" });
    }
  },

  // SQL Syntax
};
