const mongoose = require("mongoose");

const gym_booked_slots = new mongoose.Schema({
  regdNo: {
    type: "string",
  },
  Gym_scheduling_id: {
    type: "string",
  },
  start_date: {
    type: "date",
  },
  start_time: {
    type: "string",
  },
  end_time: {
    type: "string",
  },
  end_date: {
    type: "date",
  },
  generated_date: {
    type: "date",
  },
  max_count: {
    type: "number",
  },
  generated_by: {
    type: "string",
  },
  status: {
    type: "string",
  },
  generated_time: {
    type: "string",
  },
  Access_type: {
    type: "string",
  },
  Location: {
    type: "string",
  },

  occupied: {
    type: "number",
  },
  campus: {
    type: "string",
  },
  qr_code: { type: "string" },
});

const Gym_Booked_Slots = mongoose.model("gym_booked_slots", gym_booked_slots);

module.exports = Gym_Booked_Slots;
