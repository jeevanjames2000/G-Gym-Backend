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

        res.json({ message: "Token updated successfully" });
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
      res.status(500).send("Error inserting gym scheduling record");
    }
  },

  updateGymSchedule: async (req, res) => {
    const { regdNo, start_time, start_date, masterID } = req.body;

    if (!regdNo || !start_time || !start_date || !masterID) {
      return res.status(400).json("Missing required parameters");
    }

    const convertTimeTo24Hour = (time) => {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      } else if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      return date;
    };

    const currentDate = new Date().toISOString().split("T")[0];
    const startdate = start_date.split("T")[0];

    if (currentDate !== startdate) {
      return res.status(400).json("Cannot Enter before the slot date!");
    }

    const pool = req.app.locals.sql;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // history check for attendance

      const historycheck = `
      SELECT * from GYM_SLOT_DETAILS_HISTORY
      WHERE regdNo = @regdNo AND start_date = @start_date AND start_time=@start_time
      `;

      const historyResult = await transaction
        .request()
        .input("regdNo", sql.VarChar(sql.MAX), regdNo)
        .input("start_time", sql.VarChar(100), start_time)
        .input("start_date", sql.Date, start_date)
        .query(historycheck);

      const historydata = historyResult.recordset[0];

      if (historydata?.attendance === "Present") {
        return res.status(400).json("User Already Occupied");
      }

      // matching time check

      const bookingsQuery = `
      SELECT *
      FROM GYM_SLOT_DETAILS
      WHERE regdNo = @regdNo AND start_date = @start_date AND start_time=@start_time
    `;
      const bookingsResult = await transaction
        .request()
        .input("regdNo", sql.VarChar(sql.MAX), regdNo)
        .input("start_time", sql.VarChar(100), start_time)
        .input("start_date", sql.Date, start_date)
        .query(bookingsQuery);

      const currentTime = new Date();

      const match = bookingsResult.recordset.some((slot) => {
        const slotStart = convertTimeTo24Hour(slot.start_time);
        const slotEnd = convertTimeTo24Hour(slot.end_time);
        return currentTime >= slotStart && currentTime <= slotEnd;
      });

      const overtimematch = bookingsResult.recordset.some((slot) => {
        const slotEnd = convertTimeTo24Hour(slot.end_time);
        return currentTime >= slotEnd;
      });
      if (overtimematch) {
        await transaction.rollback();
        return res.status(400).json("Slot expired");
      }
      if (!match) {
        await transaction.rollback();
        return res.status(400).json("Cannot enter before the slot time");
      }

      //   // main query
      const updateQuery = `
        UPDATE GYM_SLOT_DETAILS
        SET attendance = 'Present'
        WHERE masterID = @masterID AND regdNo = @regdNo AND start_time = @start_time AND start_date = @start_date;
      `;

      const updateResult = await transaction
        .request()
        .input("regdNo", sql.VarChar(sql.MAX), regdNo)
        .input("start_time", sql.VarChar(100), start_time)
        .input("start_date", sql.Date, start_date)
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .query(updateQuery);

      if (updateResult.rowsAffected[0] === 0) {
        await transaction.rollback();
        return res.status(404).json("No slot found");
      }

      const updateHistoryQuery = `
      UPDATE GYM_SLOT_DETAILS_HISTORY
      SET attendance = 'Present', status = 'booked'
      WHERE masterID = @masterID AND regdNo = @regdNo AND start_time = @start_time AND start_date = @start_date;
    `;

      await transaction
        .request()
        .input("regdNo", sql.VarChar(sql.MAX), regdNo)
        .input("start_time", sql.VarChar(100), start_time)
        .input("start_date", sql.Date, start_date)
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .query(updateHistoryQuery);

      await transaction
        .request()
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .input("start_date", sql.Date, start_date).query(`
        UPDATE GYM_SCHEDULING_MASTER
        SET available = available + 1, occupied = occupied - 1
        WHERE ID = @masterID AND start_date=@start_date
      `);

      const deleteQuery = `
      DELETE FROM GYM_SLOT_DETAILS
      WHERE regdNo = @regdNo AND masterID = @masterID;
    `;

      await transaction
        .request()
        .input("regdNo", sql.VarChar(sql.MAX), regdNo)
        .input("start_date", sql.Date, start_date)
        .input("masterID", sql.VarChar(50), masterID)
        .query(deleteQuery);

      await transaction.commit();
      return res
        .status(200)
        .json("Gym schedule updated and slot deleted successfully");
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating gym schedule:", error);
      return res.status(500).json("Error updating gym slot attendance");
    }
  },

  // SQL Syntax
};
