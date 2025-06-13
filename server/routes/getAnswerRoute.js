const express = require("express");
const router = express.Router();

const { getAnswers } = require("../controller/getAnswerController"); 

router.get("/answers/:question_id", getAnswers); 

module.exports = router;
