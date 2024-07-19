const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const sql = require("mssql");
const generateToken = (user) => {
  const token = jwt.sign(
    { userId: user.id, username: user.regdNo },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
};
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
module.exports = {
  login: async (req, res) => {
    const { regdNo } = req.body;
    try {
      const pool = req.app.locals.sql;
      const request = pool.request();
      request.input("regdNo", sql.VarChar(50), regdNo);
      const result = await request.query(
        "SELECT * FROM GYM_SLOT_DETAILS WHERE regdNo = @regdNo"
      );
      if (result.recordset.length === 0) {
        return res.status(401).json({ error: "Invalid registration number" });
      }
      const user = result.recordset[0];
      console.log("user: ", user);
      const token = generateToken(user);
      console.log("Generated token:", token);
      const updateRequest = pool.request();
      updateRequest.input("regdNo", sql.VarChar(50), regdNo);
      updateRequest.input("token", sql.NVarChar(sql.MAX), token);
      await updateRequest.query(
        "UPDATE GYM_SLOT_DETAILS SET token = @token WHERE regdNo = @regdNo"
      );
      res.json({ token });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ error: "An error occurred during login" });
    }
  },
  logout: async (req, res) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }
    try {
      const decoded = verifyToken(token);
      const regdNo = decoded.username;
      const pool = req.app.locals.sql;
      const request = pool.request();
      request.input("regdNo", sql.VarChar(50), regdNo);
      await request.query(
        "UPDATE GYM_SLOT_DETAILS SET token = NULL WHERE regdNo = @regdNo AND token = @token",
        { token: sql.NVarChar(sql.MAX), token }
      );
      res.json({ message: "Logged out successfully" });
    } catch (err) {
      console.error("Error during logout:", err);
      res.status(500).json({ error: "An error occurred during logout" });
    }
  },
};
