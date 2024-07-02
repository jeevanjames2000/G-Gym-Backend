// models/Gym.js

const mongoose = require("mongoose");

// Define gym schema
const gymSchema = new mongoose.Schema({
  empID: {
    type: String,
  },
  studentID: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  timeslot: {
    type: String,
    required: true,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  barcode: { type: String },
  totalSlots: { type: Number, default: 45 },
  availableSlots: { type: Number, default: 45 },
  occupiedSlots: { type: Number, default: 0 },
});

const Gym = mongoose.model("Gym", gymSchema);

module.exports = Gym;
