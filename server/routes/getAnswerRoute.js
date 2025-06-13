const express = require("express");
const router = express.Router();

const { getAnswers } = require("../controller/getAnswerController"); // ✅ Must match export

router.get("/answers/:question_id", getAnswers); // ✅ getAnswers must be a function

module.exports = router;
