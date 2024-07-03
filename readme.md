### GET

# - http://localhost:3000/api/gym/getGymSchedulesByLocation/${location}/${date}

# (!need to send params (loaction and date) in endpoints of api getGymSchedulesByLocation/location/date)

# - http://localhost:3000/api/gym/getAllMasterSchedules

# - http://localhost:3000/api/gym/getGymSchedule

### POST

# - http://localhost:3000/api/gym/insertGymMasterScheduling

# body:{

"Gym_scheduling_id": "",
"start_date": "",
"start_time": "",
"end_time": "",
"end_date": "",
"generated_date": "",
"max_count": 45,
"generated_by": "",
"status": "Available",
"generated_time": "",
"Access_type": "",
"Location": "",
"ID": "",
"occupied": ,
"campus": ""
}
