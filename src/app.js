const express = require("express");
const app = express();

const connectDB = require("./config/db");

const { adminAuth } = require("./middleware/adminAuth");
const User = require("./models/user");
const e = require("express");

app.use(express.json()); // Middleware to parse JSON bodies to JS objects

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

app.get("/user", async (req, res) => {
    try {
        const userEmail = req.body.emailId;

        const user = await User.findOne({ emailId: userEmail });
        res.status(200).json({ message: "User fetched", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ message: "Users fetched", users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

app.patch("/user/:userId", async (req, res) => {
    try {
        const userID = req.params?.userId;
        const data = req.body;

        const allowedUpdates = [
            "firstName",
            "lastName",
            "password",
            "age",
            "skills",
        ];

        const requestedUpdates = Object.keys(data).every((key) =>
            allowedUpdates.includes(key)
        );

        if (!requestedUpdates) {
            return res.status(400).json({ message: "Invalid updates!" });
        }

        const user = await User.findByIdAndUpdate({ _id: userID }, data, {
            returnDocument: "after",
            runValidators: true,
        });

        res.status(200).json({ message: "User updated.", user });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server error" + error.message });
    }
});

app.delete("/user", async (req, res) => {
    try {
        const userID = req.body.userId;
        await User.findByIdAndDelete({ _id: userID });
        res.status(200).json({ message: "User deleted" });
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
            connectDB();
        });
    })
    .catch((err) => {
        console.log("DB connection failed", err);
    });
