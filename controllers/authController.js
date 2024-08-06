const jwt = require("jsonwebtoken");
require("dotenv").config();
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
      request.input("regdNo", sql.Int, regdNo);
      const result = await request.query(
        "SELECT * FROM GYM_SCHEDULING_MASTER WHERE regdNo = @regdNo"
      );
      if (result.recordset.length === 0) {
        return res.status(401).json({ error: "Invalid registration number" });
      }
      const user = result.recordset[0];
      const token = generateToken(user);
      const updateRequest = pool.request();
      updateRequest.input("regdNo", sql.VarChar(50), regdNo);
      updateRequest.input("token", sql.NVarChar(sql.MAX), token);
      await updateRequest.query(
        "UPDATE GYM_TOKEN SET token = @token WHERE regdNo = @regdNo"
      );
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: "An error occurred during login" });
    }
  },
  logout: async (req, res) => {
    const { regdno } = req.body;
    try {
      const pool = req.app.locals.sql;
      const request = pool.request();
      request.input("regdno", sql.VarChar(50), regdno);
      await request.query("DELETE FROM GYM_TOKEN WHERE regdno = @regdno");
      res.json({ message: "Logged out successfully" });
    } catch (err) {
      res.status(500).json({ error: "An error occurred during logout" });
    }
  },

  storeToken: async (req, res) => {
    const { regdno, token } = req.body;
    try {
      const pool = req.app.locals.sql;
      const request = pool.request();
      request.input("regdno", sql.VarChar(50), regdno);
      request.input("token", sql.NVarChar(sql.MAX), token);

      const updateResult = await request.query(
        "UPDATE GYM_TOKEN SET token = @token WHERE regdno = @regdno"
      );

      if (updateResult.rowsAffected[0] === 0) {
        const insertRequest = pool.request();
        insertRequest.input("regdno", sql.VarChar(50), regdno);
        insertRequest.input("token", sql.NVarChar(sql.MAX), token);
        await insertRequest.query(
          "INSERT INTO GYM_TOKEN (regdno, token) VALUES (@regdno, @token)"
        );
        res.json({ message: "New token inserted successfully" });
      } else {
        res.json({ message: "Token updated successfully" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ error: "An error occurred while processing the token" });
    }
  },
};
