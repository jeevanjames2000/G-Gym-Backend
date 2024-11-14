const sql = require("mssql");
const moment = require("moment");
// const data = require("./data");

const formatDate = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

module.exports = {
  // insert slots automatically for how many days you want to add
  insertSlots: async function (req, res) {
    const { date, numofDays } = req.params;

    try {
      const data = [
        {
          Gym_sheduling_id: "V1",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "6:00 AM",
          end_time: "7:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 56,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "V2",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "7:00 AM",
          end_time: "8:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 57,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "V3",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "8:00 AM",
          end_time: "9:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 58,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "V10",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "12:00 PM",
          end_time: "1:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 65,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "V11",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "2:00 PM",
          end_time: "3:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 66,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "V4",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "3:00 PM",
          end_time: "4:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 59,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "V5",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "4:00 PM",
          end_time: "5:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 60,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "V6",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "5:00 PM",
          end_time: "6:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 61,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "V7",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "6:00 PM",
          end_time: "7:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 62,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "V8",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "7:00 PM",
          end_time: "8:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 63,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "V9",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "8:00 PM",
          end_time: "9:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 45,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "GYM",
          ID: 64,
          occupied: 0,
          campus: "VSP",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "M1",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "5:00 AM",
          end_time: "6:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 67,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "M2",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "6:00 AM",
          end_time: "7:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Block-C",
          ID: 68,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "M3",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "7:00 AM",
          end_time: "8:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 69,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "M4",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "8:00 AM",
          end_time: "9:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 70,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "T2",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "9:00 AM",
          end_time: "10:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 71,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "T3",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "10:00 AM",
          end_time: "11:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 72,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "T1",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "11:00 AM",
          end_time: "12:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 73,
          occupied: 1,
          campus: "HYD",
          available: 1,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "T5",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "12:00 PM",
          end_time: "1:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 74,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "T4",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "2:00 PM",
          end_time: "3:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 75,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E1",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "3:00 PM",
          end_time: "4:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 76,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E2",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "4:00 PM",
          end_time: "5:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 77,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E3",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "5:00 PM",
          end_time: "6:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 78,
          occupied: 1,
          campus: "HYD",
          available: 1,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E4",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "6:00 PM",
          end_time: "7:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 79,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E5",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "7:00 PM",
          end_time: "8:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 80,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E6",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "8:00 PM",
          end_time: "9:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Block-C",
          ID: 81,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "M1",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "5:00 AM",
          end_time: "6:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Girls Hostel",
          ID: 82,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "M2",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "6:00 AM",
          end_time: "7:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Girls Hostel",
          ID: 83,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "M3",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "7:00 AM",
          end_time: "8:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Girls Hostel",
          ID: 84,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "M4",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "8:00 AM",
          end_time: "9:00 AM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Girls Hostel",
          ID: 85,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E1",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "3:00 PM",
          end_time: "4:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Girls Hostel",
          ID: 86,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E2",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "4:00 PM",
          end_time: "5:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Girls Hostel",
          ID: 87,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E3",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "5:00 PM",
          end_time: "6:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Girls Hostel",
          ID: 88,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E4",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "6:00 PM",
          end_time: "7:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Girls Hostel",
          ID: 89,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E5",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "7:00 PM",
          end_time: "8:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Girls Hostel",
          ID: 90,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "E6",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "8:00 PM",
          end_time: "9:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "F",
          Location: "Girls Hostel",
          ID: 91,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "C1",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "4:00 PM",
          end_time: "5:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Campus",
          ID: 92,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "C2",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "5:00 PM",
          end_time: "6:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Campus",
          ID: 93,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "C3",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "6:00 PM",
          end_time: "7:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Campus",
          ID: 94,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
        {
          Gym_sheduling_id: "C4",
          start_date: "2024-09-12T00:00:00.000Z",
          start_time: "7:00 PM",
          end_time: "8:00 PM",
          end_date: "2024-09-12T00:00:00.000Z",
          generated_date: "2024-09-12T00:00:00.000Z",
          max_count: 25,
          generated_by: "Cats",
          status: "A",
          generated_time: "2024-08-20T09:49:30.250Z",
          Access_type: "All",
          Location: "Campus",
          ID: 95,
          occupied: 0,
          campus: "HYD",
          available: 25,
          Maintanence: false,
        },
      ];
      const pool = req.app.locals.sql;
      const lastDate = moment(date, "YYYY-MM-DD");
      const lastDateFormatted = moment(lastDate).format("YYYY-MM-DD");

      const startDate = moment(lastDateFormatted);

      const currentDate = new Date();
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
          campus,
          Maintanence
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
          @campus,
          @Maintanence
        )
      `;

      for (let i = 0; i <= numofDays; i++) {
        const currentStartDate = moment(startDate).add(i, "days");
        const currentEndDate = currentStartDate.clone();
        const generatedDate = currentStartDate.clone();
        for (const record of data) {
          await pool
            .request()
            .input("numofDays", sql.Int, numofDays)
            .input("Gym_sheduling_id", sql.VarChar(15), record.Gym_sheduling_id)
            .input(
              "start_date",
              sql.Date,
              currentStartDate.format("YYYY-MM-DD")
            )
            .input("start_time", sql.VarChar(10), record.start_time)
            .input("end_time", sql.VarChar(10), record.end_time)
            .input("end_date", sql.Date, currentEndDate.format("YYYY-MM-DD"))
            .input(
              "generated_date",
              sql.Date,
              generatedDate.format("YYYY-MM-DD")
            )
            .input("max_count", sql.Int, record.max_count)
            .input("generated_by", sql.VarChar(100), record.generated_by)
            .input("status", sql.VarChar(15), record.status)
            .input("generated_time", sql.DateTime, generated_time)
            .input("Access_type", sql.VarChar(10), record.Access_type)
            .input("Location", sql.VarChar(20), record.Location)
            .input("available", sql.Int, record.available)
            .input("occupied", sql.Int, record.occupied)
            .input("campus", sql.VarChar(10), record.campus)
            .input("Maintanence", sql.Bit, record.Maintanence)
            .query(query);
        }
      }

      res
        .status(201)
        .send(
          `Gym scheduling records for ${numofDays} days created successfully`
        );
    } catch (error) {
      console.error(error);
      res.status(500).send("Error inserting gym scheduling records");
    }
  },

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
    const { regdNo, start_time, start_date, masterID, admin_id } = req.body;

    if (!regdNo || !start_time || !start_date || !masterID || !admin_id) {
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
        .input("admin_id", sql.VarChar(100), admin_id)

        .query(updateQuery);

      if (updateResult.rowsAffected[0] === 0) {
        await transaction.rollback();
        return res.status(404).json("No slot found");
      }

      const updateHistoryQuery = `
      UPDATE GYM_SLOT_DETAILS_HISTORY
      SET attendance = 'Present', status = 'booked',admin_id=@admin_id
      WHERE masterID = @masterID AND regdNo = @regdNo AND start_time = @start_time AND start_date = @start_date;
    `;

      await transaction
        .request()
        .input("regdNo", sql.VarChar(sql.MAX), regdNo)
        .input("start_time", sql.VarChar(100), start_time)
        .input("start_date", sql.Date, start_date)
        .input("masterID", sql.VarChar(sql.MAX), masterID)
        .input("admin_id", sql.VarChar(100), admin_id)
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

  getStarttimeByLoc: async (req, res) => {
    const Location = req.params.Location;

    const start_date = req.params.start_date;

    try {
      const pool = req.app.locals.sql;
      const result = await pool
        .request()
        .input("Location", sql.VarChar, Location)
        .input("start_date", sql.Date, start_date)
        .query(
          `SELECT start_time, 
            CONVERT(TIME, start_time, 100) AS ConvertedTime 
     FROM GYM_SCHEDULING_MASTER 
     WHERE Location = @Location 
     AND start_date = @start_date 
     ORDER BY ConvertedTime ASC`
        );

      if (result.recordset.length === 0) {
        return res.status(404).json({
          message: "No gym schedules found for the specified location and date",
        });
      }
      const startTimes = result.recordset.map((record) => record.start_time);

      res.status(200).json(startTimes);
    } catch (err) {
      console.error("Error fetching gym schedules by location and date:", err);
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },

  getLocations: async (req, res) => {
    const start_date = req.params.start_date;

    try {
      const pool = req.app.locals.sql;
      const result = await pool
        .request()
        .input("start_date", sql.Date, start_date)
        .query(
          "SELECT DISTINCT Location FROM GYM_SCHEDULING_MASTER WHERE start_date = @start_date"
        );

      if (result.recordset.length === 0) {
        return res.status(404).json({
          message: "No gym schedules found for the specified location and date",
        });
      }
      const locations = result.recordset.map((record) => record.Location);

      res.status(200).json(locations);
    } catch (err) {
      console.error("Error fetching gym schedules by location and date:", err);
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },

  getHistory: async (req, res) => {
    const { start_date, Location, start_time } = req.params;

    try {
      const pool = req.app.locals.sql;
      const result = await pool
        .request()
        .input("Location", sql.VarChar, Location)
        .input("start_date", sql.Date, start_date)
        .input("start_time", sql.VarChar(100), start_time)

        .query(
          "SELECT * FROM GYM_SLOT_DETAILS_HISTORY WHERE start_date = @start_date AND start_time=@start_time AND Location=@Location"
        );

      if (result.recordset.length === 0) {
        return res.status(404).json({
          message: "No history found for the specified location and date",
        });
      }

      const history = result.recordset;
      console.log("history: ", history);

      res.status(200).json(history);
    } catch (err) {
      console.error("Error fetching gym schedules by location and date:", err);
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },
  getCancelled: async (req, res) => {
    const { start_date, Location, start_time } = req.params;

    try {
      const pool = req.app.locals.sql;
      const result = await pool
        .request()
        .input("Location", sql.VarChar, Location)
        .input("start_date", sql.Date, start_date)
        .input("start_time", sql.VarChar(100), start_time)

        .query(
          "SELECT * FROM GYM_SLOT_DETAILS_HISTORY WHERE status='cancelled' AND start_date = @start_date AND start_time=@start_time AND Location=@Location"
        );

      if (result.recordset.length === 0) {
        return res.status(404).json({
          message: "No history found for the specified location and date",
        });
      }

      const cancelled = result.recordset;
      console.log("history: ", cancelled);

      res.status(200).json(cancelled);
    } catch (err) {
      console.error("Error fetching gym schedules by location and date:", err);
      res.status(500).json({ error: "Failed to fetch gym schedules" });
    }
  },

  insertExpoToken: async (req, res) => {
    const { Expo_token, regdno } = req.body;

    if (!Expo_token || !regdno) {
      return res
        .status(400)
        .json({ error: "Token and registration number are required" });
    }

    try {
      const pool = req.app.locals.sql;

      const checkResult = await pool
        .request()
        .input("regdno", sql.VarChar(sql.MAX), regdno)
        .query("SELECT * FROM GYM_TOKEN WHERE regdno = @regdno");
      console.log("checkResult: ", checkResult);

      if (checkResult.recordset.length > 0) {
        await pool
          .request()
          .input("Expo_token", sql.VarChar(sql.MAX), Expo_token)
          .input("regdno", sql.VarChar(sql.MAX), regdno)
          .query(
            "UPDATE GYM_TOKEN SET Expo_token = @Expo_token WHERE regdno = @regdno"
          );

        return res.status(200).json({ message: "Token updated successfully" });
      } else {
        await pool
          .request()
          .input("Expo_token", sql.VarChar(sql.MAX), Expo_token)
          .input("regdno", sql.VarChar(sql.MAX), regdno)
          .query(
            "INSERT INTO GYM_TOKEN (Expo_token, regdno) VALUES (@Expo_token, @regdno)"
          );

        return res.status(200).json({ message: "Token inserted successfully" });
      }
    } catch (error) {
      console.error("Error inserting/updating token:", error);
      return res
        .status(500)
        .json({ error: "Failed to insert or update token" });
    }
  },
};
