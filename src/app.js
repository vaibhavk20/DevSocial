const express = require("express");
const app = express();

const connectDB = require("./config/db");

const { adminAuth } = require("./middleware/adminAuth");
const User = require("./models/user");
const e = require("express");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware/auth");

app.use(express.json()); // Middleware to parse JSON bodies to JS objects
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        // validate data
        // validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // encrypt password
        const passwordHash = await bcrypt.hashSync(password, 10);

        console.log(passwordHash);

        // create user
        // const user = new User({
        //     firstName: "Vaibhav",
        //     lastName: "Kale",
        //     emailId: "vaibhav@kale",
        //     password: "vaibhav",
        // });

        const user = await User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        }).save();
        res.status(201).json({ message: "User created" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server error" + error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        // validate
        if (!emailId || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        // find user by email
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials!!!" });
        }

        // compare password
        // const isMatch = await bcrypt.compare(password, user.password);

        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // generate token (skipped for now)

        // const token = await jwt.sign({ _id: user._id }, "vabhavkale", {
        //     expiresIn: "1h",
        // });

        // offload token generation to user model
        const token = await user.getJWT();
        console.log(token);

        // send cookie

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server error" + error.message });
    }
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

app.get("/profile", auth, async (req, res) => {
    try {
        // const token = req.cookies?.token;
        // if (!token) {
        //     return res.status(401).json({ message: "Unauthorized" });
        // }

        // const decoded = await jwt.verify(token, "vabhavkale");
        // console.log(decoded);
        const decoded = req.user;

        const user = await User.findById({ _id: decoded._id });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

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
