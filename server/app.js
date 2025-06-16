// imports
const express = require("express");
const cors = require("cors");
const dbconnection = require("./db/db.Config");
const dotenv = require("dotenv");

// configuring dotenv
dotenv.config();

// middlewares
const app = express();

app.use(
  cors({
    origin: ["http://localhost:4321", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import auth middleware
const authMiddleware = require("./middleware/authMiddleware");

// import admin routes
const initDB_Router = require("./routes/initDB_route");
const createTableRouter = require("./routes/createTablesRoute");
// import user routes
const registerRouter = require("./routes/registerRoute");
const loginRouter = require("./routes/loginRoute");
const answerRoutes = require("./routes/postAnswerRoute");
const getquestions = require("./routes/getquestionsRoute");
const postQuestionRoutes = require("./routes/postQuestionsRoute");
const getAnswerRouter = require("./routes/getAnswerRoute");
const likeDislikeRouter = require("./routes/likeDislikeRoute");

// admin routes middleware
app.use("/api/admin", initDB_Router);
app.use("/api/admin", createTableRouter);
// user routes middleware
app.use("/api/user", registerRouter);
app.use("/api/user", loginRouter);
app.use("/api", getquestions);
app.use("/api", getAnswerRouter);
app.use("/api", authMiddleware, postQuestionRoutes);
app.use("/api", authMiddleware, answerRoutes);
app.use("/api", authMiddleware, likeDislikeRouter);

// Start server and test database connection
async function startServer() {
  try {
    await dbconnection.execute("SELECT 'test'");
    app.listen(process.env.PORT || 5400, () => {
      console.log(
        `Server is running on: http://localhost:${process.env.PORT || 5400}`
      );
      console.log("Database connection successful");
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
}

startServer();
