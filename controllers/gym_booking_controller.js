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
    } = req.body;

    if (
      !regdNo ||
      !start_date ||
      !Gym_sheduling_id ||
      !start_time ||
      !end_time ||
      !Location ||
      !campus
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }

    try {
      const pool = req.app.locals.sql;

      const activeSlotsQuery = `
            SELECT * FROM GYM_SLOT_DETAILS
            WHERE regdNo = @regdNo AND status = 'booked'
        `;
      const activeSlotsResult = await pool
        .request()
        .input("regdNo", sql.VarChar(50), regdNo)
        .query(activeSlotsQuery);

      if (activeSlotsResult.recordset.length > 0) {
        return res.status(400).json({
          status: "error",
          message: "User already has active slots.",
        });
      }

      const availableSlotsQuery = `
            SELECT * FROM GYM_SCHEDULING_MASTER
            WHERE Gym_sheduling_id = @Gym_sheduling_id
        `;
      const availableSlotsResult = await pool
        .request()
        .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
        .query(availableSlotsQuery);

      const availableSlot = availableSlotsResult.recordset[0];

      if (!availableSlot) {
        return res.status(400).json({
          status: "error",
          message: "Invalid Gym_sheduling_id provided.",
        });
      }

      // Ensure there is an available slot to book
      if (availableSlot.available <= 0) {
        return res.status(400).json({
          status: "error",
          message: "No available slots.",
        });
      }

      const currentDate = new Date(start_date);

      const convertTime = (time) => {
        const [formattedTime, modifier] = time.split(" ");
        let [hours, minutes] = formattedTime.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        else if (modifier === "AM" && hours === 12) hours = 0;
        return `${hours}:${minutes}`;
      };

      const formattedStartTime = convertTime(start_time);
      const formattedEndTime = convertTime(end_time);

      for (let i = 0; i < 31; i++) {
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() + i);

        const bookingData = {
          regdNo,
          Gym_sheduling_id,
          start_date: startDate, // Use startDate directly
          start_time,
          end_time,
          Location,
          campus,
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
                    qr_code
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
                    @qr_code
                )
            `;

        await pool
          .request()
          .input("regdNo", sql.VarChar(50), regdNo)
          .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
          .input("start_date", sql.Date, startDate)
          .input("start_time", sql.VarChar(10), start_time)
          .input("end_time", sql.VarChar(10), end_time)
          .input("end_date", sql.Date, startDate)
          .input("generated_date", sql.Date, currentDate)
          .input("status", sql.VarChar(15), "booked")
          .input("Location", sql.VarChar(20), Location)
          .input("campus", sql.VarChar(10), campus)
          .input("qr_code", sql.NVarChar(sql.MAX), qrCode)
          .query(bookingInsertQuery);
      }

      const updateQuery = `
            UPDATE GYM_SCHEDULING_MASTER
            SET available = available - 1, occupied = occupied + 1
            WHERE Gym_sheduling_id = @Gym_sheduling_id
        `;

      await pool
        .request()
        .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
        .query(updateQuery);

      return res.status(200).json({
        status: "success",
        message: "Slots booked successfully for the next 30 days.",
      });
    } catch (error) {
      console.error(
        "Error inserting or updating gym scheduling record:",
        error
      );
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
    const { regdNo } = req.params;

    if (!regdNo) {
      return res.status(400).send("Missing required parameter: regdNo");
    }

    try {
      const pool = req.app.locals.sql;

      const bookingsQuery = `
          SELECT Gym_sheduling_id, start_date, start_time
          FROM GYM_SLOT_DETAILS
          WHERE regdNo = @regdNo
      `;
      const bookingsResult = await pool
        .request()
        .input("regdNo", sql.VarChar(10), regdNo)
        .query(bookingsQuery);

      const bookings = bookingsResult.recordset;

      if (bookings.length === 0) {
        return res
          .status(404)
          .send("No bookings found for the provided regdNo");
      }

      const deleteQuery = `
          DELETE FROM GYM_SLOT_DETAILS
          WHERE regdNo = @regdNo
      `;
      await pool
        .request()
        .input("regdNo", sql.VarChar(10), regdNo)
        .query(deleteQuery);

      const updates = bookings.map(async (booking) => {
        const { Gym_sheduling_id, start_date, start_time } = booking;

        const matchingSlotQuery = `
            SELECT ID, available, occupied
            FROM GYM_SCHEDULING_MASTER
            WHERE Gym_sheduling_id = @Gym_sheduling_id
            AND start_date = @start_date
            AND start_time = @start_time
        `;
        const matchingSlotResult = await pool
          .request()
          .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
          .input("start_date", sql.Date, start_date)
          .input("start_time", sql.VarChar(10), start_time)
          .query(matchingSlotQuery);

        if (matchingSlotResult.recordset.length > 0) {
          const slotId = matchingSlotResult.recordset[0]._id;

          await pool
            .request()
            .input("Gym_sheduling_id", sql.VarChar(15), Gym_sheduling_id)
            .query(`
                UPDATE GYM_SCHEDULING_MASTER
                SET available = available + 1,
                    occupied = occupied - 1
                WHERE Gym_sheduling_id = @Gym_sheduling_id
            `);
        }
      });

      await Promise.all(updates);
      res.status(200).json({ message: "Bookings deleted successfully" });
    } catch (error) {
      console.error("Error deleting bookings:", error);
      res.status(500).send("Internal server error");
    }
  },

  // SQL Syntax
};
