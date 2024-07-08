const mongoose = require("mongoose");

const gym_master_schema = new mongoose.Schema({
  Gym_scheduling_id: { type: "string" },
  regdNo: {
    type: "string",
  },
  start_date: { type: "date" },
  start_time: { type: "string" },
  end_time: { type: "string" },
  end_date: { type: "date" },
  generated_date: { type: "date" },
  max_count: { type: "number" },
  generated_by: { type: "string" },
  status: { type: "string" },
  generated_time: { type: "string" },
  available: { type: "number" },
  Access_type: { type: "string" },
  Location: { type: "string" },
  occupied: { type: "number" },
  campus: { type: "string" },
});

const Gym_Master = mongoose.model("Gym_Master", gym_master_schema);

module.exports = Gym_Master;
