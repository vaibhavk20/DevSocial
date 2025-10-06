const express = require("express");
const app = express();

const connectDB = require("./config/db");

const { adminAuth } = require("./middleware/adminAuth");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    // create user
    const user = new User({
        firstName: "Vaibhav",
        lastName: "Kale",
        emailId: "vaibhav@kale",
        password: "vaibhav",
    });

    await user.save();
    res.status(201).json({ message: "User created", user });
});

connectDB()
    .then(() => {
        console.log("DB connected");
        app.listen(3000, () => {
            console.log("server started: 3000");
            connectDB();
        });
    })
    .catch((err) => {
        console.log("DB connection failed", err);
    });
