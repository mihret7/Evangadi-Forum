const express = require("express");
const { userProfile } = require("../controller/userProfileController");
const authMiddleware = require("../middleware/authMiddleware");

const userProfileRouter = express.Router();

userProfileRouter.get("/user-profile", authMiddleware, userProfile);

module.exports = userProfileRouter;
