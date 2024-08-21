const sql = require("mssql");
const qr = require("qrcode");
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
module.exports = {
  // SQL Syntax

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
            INSERT INTO GYM_SLOT_DETAILS (
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
  getGymSchedulesByLocationSQL: async function (req, res) {
    const locationId = req.params.locationId;
    const date = req.params.date;
    console.log("date: ", date);

    try {
      const query = `
              SELECT *
              FROM GYM_SLOT_DETAILS
              WHERE Location = @locationId
                AND start_date = @date
          `;

      const result = await sql.query(query, {
        locationId,
        date,
      });

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
  insertGymMasterSchedulingSQL: async function (req, res) {
    const {
      regdNo,
      start_date,
      start_time,
      Gym_sheduling_id,
      end_time,
      Location,
      campus,
      masterID,
    } = req.body;

    if (
      !regdNo ||
      !start_date ||
      !Gym_sheduling_id ||
      !start_time ||
      !end_time ||
      !Location ||
      !campus ||
      !masterID
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }

    const pool = req.app.locals.sql;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();
      const slotsQuery = `
    SELECT start_time
    FROM GYM_SLOT_DETAILS_HISTORY
    WHERE start_date = @start_date AND attendance = 'Present'
    UNION ALL
    SELECT start_time
    FROM GYM_SLOT_DETAILS
    WHERE start_date = @start_date AND regdNo = @regdNo AND status = 'booked'
  `;
      const slotsResult = await transaction
        .request()
        .input("start_date", sql.Date, start_date)
        .input("regdNo", sql.VarChar(50), regdNo)
        .query(slotsQuery);

      const currentSlotTimePeriod = start_time.slice(-2);

      let amSlotExists = false;
      let pmSlotExists = false;

      slotsResult.recordset.forEach((slot) => {
        const slotTimePeriod = slot.start_time.slice(-2);
        if (slotTimePeriod === "AM") {
          amSlotExists = true;
        } else if (slotTimePeriod === "PM") {
          pmSlotExists = true;
        }
      });

      if (
        (currentSlotTimePeriod === "AM" && amSlotExists) ||
        (currentSlotTimePeriod === "PM" && pmSlotExists)
      ) {
        await transaction.rollback();
        return res.status(400).json({
          status: "error",
          message:
            "Cannot book more than one slot in the same time zone (AM/PM) per day.",
        });
      }

      if (amSlotExists && pmSlotExists) {
        await transaction.rollback();
        return res.status(400).json({
          status: "error",
          message: "Maximum of 2 slots allowed per day: one AM and one PM.",
        });
      }
      // prev

      const availableSlotsQuery = `
      SELECT * FROM GYM_SCHEDULING_MASTER
      WHERE Gym_sheduling_id = @Gym_sheduling_id
    `;
      const availableSlotsResult = await transaction
        .request()
        .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
        .query(availableSlotsQuery);

      const availableSlot = availableSlotsResult.recordset[0];

      if (!availableSlot) {
        await transaction.rollback();
        return res.status(400).json({
          status: "error",
          message: "Invalid Gym_sheduling_id provided.",
        });
      }

      if (availableSlot.available <= 0) {
        await transaction.rollback();
        return res.status(400).json({
          status: "error",
          message: "No available slots.",
        });
      }

      const currentDate = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const localDate = new Date(currentDate.getTime() + istOffset);

      const bookingData = {
        regdNo,
        Gym_sheduling_id,
        start_date,
        start_time,
        end_time,
        Location,
        campus,
        masterID,
      };

      const qrCode = await generateQRCode(bookingData);

      const bookingInsertQuery = `
      INSERT INTO GYM_SLOT_DETAILS (
        regdNo,
        Gym_sheduling_id,
        start_date,
        start_time,
        end_time,
        end_date,
        generated_date,
        status,
        Location,
        campus,
        masterID,
        qr_code,
        attendance
      ) VALUES (
        @regdNo,
        @Gym_sheduling_id,
        @start_date,
        @start_time,
        @end_time,
        @end_date,
        @generated_date,
        @status,
        @Location,
        @campus,
        @masterID,
        @qr_code,
        @attendance
      )
    `;

      await transaction
        .request()
        .input("regdNo", sql.VarChar(50), regdNo)
        .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
        .input("start_date", sql.Date, start_date)
        .input("start_time", sql.VarChar(10), start_time)
        .input("end_time", sql.VarChar(10), end_time)
        .input("end_date", sql.Date, start_date)
        .input("generated_date", sql.Date, localDate)
        .input("status", sql.VarChar(15), "booked")
        .input("Location", sql.VarChar(20), Location)
        .input("campus", sql.VarChar(10), campus)
        .input("qr_code", sql.NVarChar(sql.MAX), qrCode)
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .input("attendance", sql.VarChar(50), null)
        .query(bookingInsertQuery);

      const historyInsertQuery = `
      INSERT INTO GYM_SLOT_DETAILS_HISTORY (
        regdNo,
        Gym_sheduling_id,
        start_date,
        start_time,
        end_time,
        end_date,
        generated_date,
        status,
        Location,
        campus,
        masterID,
        attendance
      ) VALUES (
        @regdNo,
        @Gym_sheduling_id,
        @start_date,
        @start_time,
        @end_time,
        @end_date,
        @generated_date,
        @status,
        @Location,
        @campus,
        @masterID,
        @attendance
        
      )
    `;

      await transaction
        .request()
        .input("regdNo", sql.VarChar(50), regdNo)
        .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
        .input("start_date", sql.Date, start_date)
        .input("start_time", sql.VarChar(10), start_time)
        .input("end_time", sql.VarChar(10), end_time)
        .input("end_date", sql.Date, start_date)
        .input("generated_date", sql.DateTime, localDate)
        .input("status", sql.VarChar(15), "booked")
        .input("Location", sql.VarChar(20), Location)
        .input("campus", sql.VarChar(10), campus)
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .input("attendance", sql.VarChar(50), null)

        .query(historyInsertQuery);

      const updateQuery = `
      UPDATE GYM_SCHEDULING_MASTER
      SET available = available - 1, occupied = occupied + 1
      WHERE ID = @masterID
    `;

      await transaction
        .request()
        .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .query(updateQuery);

      await transaction.commit();

      return res.status(200).json({
        status: "success",
        message: "Slot booked successfully.",
      });
    } catch (error) {
      console.error(
        "Error inserting or updating gym scheduling record:",
        error
      );
      await transaction.rollback();
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  },

  getGymBookingsByRegdNo: async (req, res) => {
    const { regdNo } = req.params;

    if (!regdNo) {
      return res.status(400).send("Missing required parameter: regdNo");
    }

    try {
      const pool = req.app.locals.sql;

      const request = pool.request();
      request.input("regdNo", sql.VarChar(10), regdNo);

      const bookingsQuery = `
          SELECT * FROM GYM_SLOT_DETAILS
          WHERE regdNo = @regdNo
      `;
      const bookingsResult = await request.query(bookingsQuery);

      if (bookingsResult.recordset.length === 0) {
        return res
          .status(404)
          .send("No bookings found for the provided regdNo");
      }

      res.status(200).json(bookingsResult.recordset);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).send("Internal server error");
    }
  },

  deleteGymBookingsByRegdNo: async (req, res) => {
    const { regdNo, masterID, message, status } = req.body;

    if (!regdNo && !masterID) {
      return res
        .status(400)
        .send("Missing required parameter: regdNo or masterID");
    }

    let transaction;
    try {
      const pool = req.app.locals.sql;
      transaction = new sql.Transaction(pool);

      await transaction.begin();

      const bookingsQuery = `
      SELECT * 
      FROM GYM_SLOT_DETAILS
      WHERE regdNo = @regdNo AND masterID = @masterID
    `;
      const bookingsResult = await transaction
        .request()
        .input("regdNo", sql.VarChar(10), regdNo)
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .query(bookingsQuery);

      const bookings = bookingsResult.recordset;

      if (bookings.length === 0) {
        await transaction.rollback();
        return res
          .status(404)
          .send("No bookings found for the provided regdNo and masterID");
      }

      const deleteQuery = `
      DELETE FROM GYM_SLOT_DETAILS
      WHERE regdNo = @regdNo AND masterID = @masterID
    `;
      await transaction
        .request()
        .input("regdNo", sql.VarChar(10), regdNo)
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .query(deleteQuery);

      const updates = bookings.map(async (booking) => {
        const { Gym_sheduling_id, Location } = booking;

        const matchingSlotQuery = `
        SELECT ID, available, occupied
        FROM GYM_SCHEDULING_MASTER
        WHERE Gym_sheduling_id = @Gym_sheduling_id AND ID = @masterID AND Location = @Location
      `;

        const matchingSlotResult = await transaction
          .request()
          .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
          .input("Location", sql.VarChar(20), Location)
          .input("masterID", sql.VarChar(sql.MAX), masterID)
          .query(matchingSlotQuery);

        if (matchingSlotResult.recordset.length > 0) {
          await transaction
            .request()
            .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
            .input("masterID", sql.VarChar(sql.MAX), masterID)
            .input("Location", sql.VarChar(20), Location).query(`
            UPDATE GYM_SCHEDULING_MASTER
            SET available = available + 1, occupied = occupied - 1
            WHERE ID = @masterID AND Gym_sheduling_id = @Gym_sheduling_id  AND Location = @Location
          `);
        }
      });

      await Promise.all(updates);

      const historyInsertQuery = `
      INSERT INTO GYM_SLOT_DETAILS_HISTORY (
        regdNo,
        Gym_sheduling_id,
        start_date,
        start_time,
        end_time,
        end_date,
        generated_date,
        status,
        Location,
        campus,
        masterID,
        attendance
      ) VALUES (
        @regdNo,
        @Gym_sheduling_id,
        @start_date,
        @start_time,
        @end_time,
        @end_date,
        @generated_date,
        @status,
        @Location,
        @campus,
        @masterID,
        @attendance
      )
    `;

      const currentDate = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const localDate = new Date(currentDate.getTime() + istOffset);

      await transaction
        .request()
        .input("regdNo", sql.VarChar(50), regdNo)
        .input(
          "Gym_sheduling_id",
          sql.VarChar(15),
          bookings[0].Gym_sheduling_id
        )
        .input("start_date", sql.Date, bookings[0].start_date)
        .input("start_time", sql.VarChar(10), bookings[0].start_time)
        .input("end_time", sql.VarChar(10), bookings[0].end_time)
        .input("end_date", sql.Date, bookings[0].end_date)
        .input("generated_date", sql.DateTime, localDate)
        .input("Location", sql.VarChar(20), bookings[0].Location)
        .input("campus", sql.VarChar(10), bookings[0].campus)
        .input("status", sql.VarChar(20), status)
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .input("attendance", sql.VarChar(50), message)
        .query(historyInsertQuery);

      await transaction.commit();
      res.status(200).json({
        message: "Bookings history updated successfully",
      });
    } catch (error) {
      console.error("Error deleting bookings:", error);
      if (transaction) {
        await transaction.rollback();
      }
      res.status(500).send("Internal server error");
    }
  },

  // History Get API

  getAllHistory: async (req, res) => {
    try {
      const pool = req.app.locals.sql;
      const result = await pool
        .request()
        .query(
          "SELECT TOP 15 * FROM GYM_SLOT_DETAILS_HISTORY ORDER BY id DESC"
        );
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error("Error fetching gym schedules:", err);
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },

  getAdminSlots: async (req, res) => {
    const { regdNo, start_time } = req.params;

    if (!regdNo) {
      return res.status(400).send("Missing required parameter: regdNo");
    }

    try {
      const pool = req.app.locals.sql;

      const request = pool.request();
      request.input("regdNo", sql.VarChar(10), regdNo);
      request.input("start_time", sql.VarChar(100), start_time);
      // request.input("start_date", sql.Date, start_date);

      const bookingsQuery = `
          SELECT * FROM GYM_SLOT_DETAILS
          WHERE regdNo = @regdNo AND start_time = @start_time
      `;
      const bookingsResult = await request.query(bookingsQuery);

      if (bookingsResult.recordset.length === 0) {
        return res
          .status(404)
          .json("No bookings found for the provided regdNo");
      }

      res.status(200).json(bookingsResult.recordset);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).send("Internal server error");
    }
  },

  // SQL Syntax
};
