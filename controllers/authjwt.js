const jwt = require("jsonwebtoken");
require("dotenv").config();
const sql = require("mssql");
const generateToken = (user) => {
  const JWT_SECRET =
    "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f";

  const token = jwt.sign(
    {
      regdNo: user.regdno,
      username: user.name,
      mobile: user.mobile,
      hostler: user.hostler,
      gender: user.gender,
      campus: user.campus,
    },
    JWT_SECRET,
    { expiresIn: "1m" }
  );
  return token;
};
// const verifyToken = (token) => {
//   return jwt.decode(token, process.env.JWT_SECRET);
// };

module.exports = {
  login: async (req, res) => {
    const { regdNo } = req.body;

    try {
      const pool = req.app.locals.sql;
      const request = pool.request();
      request.input("regdNo", sql.VarChar(sql.MAX), regdNo);
      const result = await request.query(
        "SELECT * FROM GYM_SLOT_DETAILS WHERE regdNo = @regdNo"
      );
      if (result.recordset.length === 0) {
        return res.status(401).json({ error: "Invalid registration number" });
      }
      const user = result.recordset[0];
      const token = generateToken(user);
      const updateRequest = pool.request();
      updateRequest.input("regdNo", sql.VarChar(sql.MAX), regdNo);
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
      request.input("regdno", sql.VarChar(sql.MAX), regdno);
      await request.query("DELETE FROM GYM_TOKEN WHERE regdno = @regdno");
      res.json({ message: "Logged out successfully" });
    } catch (err) {
      res.status(500).json({ error: "An error occurred during logout" });
    }
  },

  storeToken: async (req, res) => {
    const { mobile, hostler, gender, campus, name, regdno } = req.body;
    try {
      const user = { mobile, hostler, gender, campus, name, regdno };
      const token = generateToken(user);

      const pool = req.app.locals.sql;
      const request = pool.request();
      request.input("regdno", sql.VarChar(sql.MAX), regdno);
      request.input("token", sql.NVarChar(sql.MAX), token);

      const updateResult = await request.query(
        "UPDATE GYM_TOKEN SET token = @token WHERE regdno = @regdno"
      );

      if (updateResult.rowsAffected[0] === 0) {
        const insertRequest = pool.request();
        insertRequest.input("regdno", sql.VarChar(sql.MAX), regdno);
        insertRequest.input("token", sql.NVarChar(sql.MAX), token);
        await insertRequest.query(
          "INSERT INTO GYM_TOKEN (regdno, token) VALUES (@regdno, @token)"
        );
        res.json({ token: token });
      } else {
        res.json({ token: token });
      }
    } catch (err) {
      res
        .status(500)
        .json({ error: "An  error occurred while processing the token" });
    }
  },
};
