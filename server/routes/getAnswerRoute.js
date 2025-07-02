const express = require("express");
const { getAnswers } = require("../controller/getAnswerController");

const { getAnswers } = require("../controller/getAnswerController"); 

router.get("/answers/:question_id", getAnswers); 

getAnswerRouter.get("/answer/:question_id", getAnswers)

module.exports=getAnswerRouter