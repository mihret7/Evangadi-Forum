const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

async function userProfile(req, res) {
  const user_id = req.user.userid; 
  try {
    let query = `SELECT p.*, r.user_name FROM profile p JOIN registration r ON p.user_id = r.user_id WHERE p.user_id = ?`;

    const [profile] = await dbconnection.query(query, [user_id]); // parameterized query
    console.log(profile);
    res.status(StatusCodes.ACCEPTED).json({ profile });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error retrieving profile", error: error.message });
  }
}

module.exports = { userProfile };
