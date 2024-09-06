require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql");
const app = express();
const port = process.env.PORT;
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");

app.use(cors());

// sql server connections
const sqlConfig = {
  user: "sa",
  password: "SQL@UAT123!@#",
  server: "192.168.64.36",
  database: "GYM",
  options: {
    encrypt: false,
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = port || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
