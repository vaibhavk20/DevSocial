const express = require("express");
const app = express();

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

app.use(express.json()); // Middleware to parse JSON bodies to JS objects
app.use(cookieParser());

app.use("/", authRouter);
app.use("/user", profileRouter);
app.use("/", requestRouter);

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ message: "Users fetched", users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

connectDB()
    .then(() => {
        console.log("DB connected");
        app.listen(3000, () => {
            console.log("server started: 3000");
        });
    })
    .catch((err) => {
        console.log("DB connection failed", err);
    });
