const express = require('express')
const { getAllQuestions, getSingleQuestion } = require('../controller/getquestionsController'); // Updated path and destructuring


const getQuestionRouter = express.Router();


getQuestionRouter.get("/all-question", getAllQuestions);
getQuestionRouter.get('/question/:id', getSingleQuestion) //! "get sigle questins"

module.exports = getQuestionRouter;









