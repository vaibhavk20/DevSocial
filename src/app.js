const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const { adminAuth } = require("./middleware/adminAuth");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware/auth");
const { authRouter } = require("./router/auth.router");
const { profileRouter } = require("./router/profile.router");
const { requestRouter } = require("./router/request.router");
const { userRouter } = require("./router/user.router");

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json()); // Middleware to parse JSON bodies to JS objects
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
    .then(() => {
        console.log("DB connected");
        app.listen(process.env.PORT, () => {
            console.log("server started: 3000");
        });
    })
    .catch((err) => {
        console.log("DB connection failed", err);
    });
