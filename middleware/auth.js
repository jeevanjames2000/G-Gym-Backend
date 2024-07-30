const jwt = require("jsonwebtoken");
const sql = require("mssql");

const authenticateJWT = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  const key = process.env.KEY;
  const issuer = process.env.ISSUER;
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const decoded = jwt.decode(token);

    const pool = req.app.locals.sql;
    const request = pool.request();
    request.input("token", sql.NVarChar(sql.MAX), token);

    const result = await request.query(
      "SELECT * FROM GYM_SLOT_DETAILS_HISTORY WHERE token = @token"
    );

    if (result.recordset.length === 0) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.sendStatus(403); // Forbidden
  }
};

module.exports = authenticateJWT;
