const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
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

// Middleware
app.use(bodyParser.json());

app.use("/api/gym", require("./routes/gymRoutes"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
