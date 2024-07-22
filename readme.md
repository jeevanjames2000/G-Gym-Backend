# G-Sports

G-Sports Used for Slots booking for gym and stadium courts

## Table of Contents

1. [Introduction]- Slots Booking for GYM and Stadium
2. [Features] (JWT,nodejs,qr code generation,authentication)
3. [Installation](npm install,npm run dev || npm start)
4. [Usage](npm start)
5. [API-Endpoints](
   # Need to login first and get the jwt token to access this apis
   1.(api/gym/getAllMasterSchedules)-master db
   2.(api/gym/getGymSchedulesByLocation/:locationId/:date)-master db
   3.(api/gym/insertGymMasterScheduling)-master db
   4.(slot/gym/getGymSchedulesByLocationSQL/:locationId/:date)-slot booking
   5.(slot/gym/insertGymMasterScheduling)- slot booking insert
   6.(slot/gym/getGymBookingsByRegdNo/:regdNo)-slot booking get by regdno
   7.(slot/gym/deleteGymBookingsByRegdNo/:regdNo)-slot booking delete by regdno
   )

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jeevanjames2000/G-Gym-Backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd G-Gym-Backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm run dev || npm start
   ```
2. Access the project in your browser at `http://localhost:3000`

### Available Scripts

- `npm start`: Start the development server.
- `npm run dev`: Start the server with nodemon for automatic restarts.
- `npm test`: Run tests.
- `npm run build`: Build the project for production.

### User Endpoints

- **GET /api/users**: Get all users
- **POST /api/users**: Create a new user
- **GET /api/users/:id**: Get a user by ID
- **PUT /api/users/:id**: Update a user by ID
- **DELETE /api/users/:id**: Delete a user by ID

## Configuration
