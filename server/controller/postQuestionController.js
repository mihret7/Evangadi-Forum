const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/db.Config");

async function postQuestion(req, res) {
  try {
    const { title, description, tag, userId } = req.body;
    console.log(title, description, userId);

    // Validate required fields
    if (!title || !description || !userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Title, description and user-ID are required",
      });
    }

    // Generate a unique post_id 
    const postId = Math.floor(Math.random() * 2147483647) + 1;

    // Insert question into database
    const [result] = await dbConnection.query(
      "INSERT INTO question (question_title, question_description, tag, user_id, post_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, tag || null, userId, postId]
    );

    res.status(StatusCodes.CREATED).json({
      message: "Question posted successfully",
      // question: question[0],
    });

  } catch (error)
   {
    console.error("Error posting question:", error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({

      message: "Error posting question",
      error: error.message,

    });
  }
}




module.exports = { postQuestion };
 

