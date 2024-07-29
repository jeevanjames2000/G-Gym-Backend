require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql");
const app = express();
const port = process.env.PORT;

app.use(cors());

// mongodb connection
// mongoose
//   .connect(
//     "mongodb+srv://jtamada:a4oDDDQ5nRak03rQ@cluster0.ln5fxwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//   )
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err.message);
//   });

// sql server connections
const sqlConfig = {
  user: "sa",
  password: "SQL@UAT123!@#",
  server: "192.168.64.36",
  database: "GYM",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// const sqlConfig = {
//   user: "catsuser",
//   password: "dbaccess123!@#",
//   server: "192.168.23.19",
//   database: "GITAM",
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// };
sql
  .connect(sqlConfig)
  .then((pool) => {
    if (pool.connected) {
      console.log("SQL Server connected");
    }
    app.locals.sql = pool;
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server:", err.message);
  });
app.use(bodyParser.json());

app.use("/api/gym", require("./routes/gymRoutes"));
app.use("/slot/gym", require("./routes/bookingRoutes"));
app.use("/auth", require("./routes/authRoutes"));

const PORT = port || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
