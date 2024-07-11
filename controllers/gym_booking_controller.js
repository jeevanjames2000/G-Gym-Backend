const sql = require("mssql");
const Gym_Master = require("../models/gym_Master");
const Gym_Booked_Slots = require("../models/gym_booked_slots");
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
  getGymSchedulesByLocationMongo: async function (req, res) {
    const locationId = req.params.locationId;
    const date = new Date(req.params.date);
    try {
      const result = await Gym_Master.find({
        Location: locationId,
        start_date: date,
      });
      if (result.length === 0) {
        return res.status(404).json({
          message: "No gym schedules found for the specified location and date",
        });
      }
      res.status(200).json(result);
    } catch (err) {
      console.error(
        "Error fetching gym schedules by location ID and date:",
        err
      );
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },
  insertGymMasterSchedulingMongo: async function (req, res) {
    const {
      regdNo,
      start_date,
      start_time,
      Gym_scheduling_id,
      end_time,
      Location,
      campus,
    } = req.body;
    if (
      !regdNo ||
      !start_date ||
      !Gym_scheduling_id ||
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
      const activeSlots = await Gym_Booked_Slots.find({
        regdNo,
        status: "booked",
      });
      if (activeSlots.length > 0) {
        return res.status(400).json({
          status: "error",
          message: "User already have active slots.",
        });
      }
      const availableSlots = await Gym_Master.find({
        Gym_scheduling_id,
      });
      const matchingSlots = availableSlots.filter((slot) => {
        return (
          slot.start_date.toISOString().split("T")[0] === start_date &&
          slot.start_time === start_time
        );
      });
      const availableSlot = matchingSlots.find((slot) => slot.available > 0);
      if (!availableSlot) {
        return res.status(400).json({
          status: "error",
          message: "No available slots.",
        });
      }
      const currentDate = new Date(start_date);
      const convertTime = (time) => {
        const [formattedTime, modifier] = time.split(" ");
        let [hours, minutes] = formattedTime.split(":");
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        if (modifier === "PM" && hours !== 12) {
          hours += 12;
        } else if (modifier === "AM" && hours === 12) {
          hours = 0;
        }
        return { formattedTime: `${hours}:${minutes}`, originalTime: time };
      };
      const {
        formattedTime: formattedStartTime,
        originalTime: originalStartTime,
      } = convertTime(start_time);
      const { formattedTime: formattedEndTime, originalTime: originalEndTime } =
        convertTime(end_time);
      for (let i = 0; i < 31; i++) {
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() + i);
        const bookingData = {
          regdNo,
          start_date: startDate.toISOString().split("T")[0],
          start_time: originalStartTime,
          end_time: originalEndTime,
          Location,
          campus,
        };
        const qrCode = await generateQRCode(bookingData);
        const booking = new Gym_Booked_Slots({
          regdNo,
          Gym_scheduling_id,
          start_date: startDate,
          start_time,
          end_time,
          end_date: startDate,
          generated_date: new Date(),
          generated_by: "Cats",
          status: "booked",
          generated_time: new Date().toISOString(),
          Location,
          campus,
          qr_code: qrCode,
        });
        await booking.save();
      }
      await Gym_Master.updateOne(
        { _id: availableSlot._id },
        { $inc: { available: -1 } }
      );
      await Gym_Master.updateOne(
        { _id: availableSlot._id },
        { $inc: { occupied: +1 } }
      );
      return res.status(200).json({
        status: "success",
        message: "Slots booked successfully for the next 30 days.",
      });
    } catch (error) {
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
      const bookings = await Gym_Booked_Slots.find({ regdNo });
      if (bookings.length === 0) {
        return res
          .status(404)
          .send("No bookings found for the provided regdNo");
      }
      res.status(200).json(bookings);
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
      const bookings = await Gym_Booked_Slots.find({ regdNo });
      if (bookings.length === 0) {
        return res
          .status(404)
          .send("No bookings found for the provided regdNo");
      }
      const result = await Gym_Booked_Slots.deleteMany({ regdNo });
      const updates = bookings.map(async (booking) => {
        const { Gym_scheduling_id, start_date, start_time } = booking;
        const matchingSlot = await Gym_Master.findOne({
          Gym_scheduling_id,
          start_date: start_date.toISOString().split("T")[0],
          start_time,
        });
        if (matchingSlot) {
          await Gym_Master.updateOne(
            { _id: matchingSlot._id },
            { $inc: { available: +1 } }
          );
          await Gym_Master.updateOne(
            { _id: matchingSlot._id },
            { $inc: { occupied: -1 } }
          );
        }
      });
      await Promise.all(updates);
      res.status(200).json({ message: "Bookings deleted successfully" });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  },
  updateGymMasterSchedulingMongo: async function (req, res) {
    const {
      regdNo,
      start_date,
      start_time,
      Gym_scheduling_id,
      end_time,
      Location,
      campus,
    } = req.body;
    if (
      !regdNo ||
      !start_date ||
      !Gym_scheduling_id ||
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
      const existingSlot = await Gym_Booked_Slots.findOne({
        regdNo,
        Gym_scheduling_id,
      });
      if (!existingSlot) {
        return res
          .status(404)
          .json({ status: "error", message: "Slot not found" });
      }
      const currentDate = new Date(start_date);
      const convertTime = (time) => {
        const [formattedTime, modifier] = time.split(" ");
        let [hours, minutes] = formattedTime.split(":");
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        if (modifier === "PM" && hours !== 12) {
          hours += 12;
        } else if (modifier === "AM" && hours === 12) {
          hours = 0;
        }
        return { formattedTime: `${hours}:${minutes}`, originalTime: time };
      };
      const {
        formattedTime: formattedStartTime,
        originalTime: originalStartTime,
      } = convertTime(start_time);
      const { formattedTime: formattedEndTime, originalTime: originalEndTime } =
        convertTime(end_time);
      existingSlot.start_date = currentDate;
      existingSlot.start_time = start_time;
      existingSlot.end_time = end_time;
      existingSlot.Location = Location;
      existingSlot.campus = campus;
      existingSlot.generated_date = new Date();
      existingSlot.generated_time = new Date().toISOString();
      const bookingData = {
        regdNo,
        start_date: currentDate.toISOString().split("T")[0],
        start_time: originalStartTime,
        end_time: originalEndTime,
        Location,
        campus,
      };
      const qrCode = await generateQRCode(bookingData);
      existingSlot.qr_code = qrCode;
      await existingSlot.save();
      return res.status(200).json({
        status: "success",
        message: "Slot updated successfully.",
      });
    } catch (error) {
      console.error("Error updating slot:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  },
};
