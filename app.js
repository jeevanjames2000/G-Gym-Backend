const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql");

const app = express();
app.use(cors());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://jtamada:a4oDDDQ5nRak03rQ@cluster0.ln5fxwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// SQL Server connection configuration
const sqlConfig = {
  user: "sa",
  password: "SQL@UAT123!@#",
  server: "192.168.64.36",
  database: "GYM",
  options: {
    encrypt: true, // for Azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

// Connect to SQL Server
sql
  .connect(sqlConfig)
  .then((pool) => {
    if (pool.connected) {
      console.log("SQL Server connected");
    }
    // Use the pool connection in your routes
    app.locals.sql = pool;
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server:", err.message);
  });

// Middleware
app.use(bodyParser.json());

app.get("/api/test-sql", async (req, res) => {
  try {
    const pool = req.app.locals.sql;
    const result = await pool
      .request()
      .query("select* from GYM_SCHEDULING_MASTER");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Error querying SQL Server: " + err.message);
  }
});

app.use("/api/gym", require("./routes/gymRoutes"));
app.use("/slot/gym", require("./routes/bookingRoutes"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
