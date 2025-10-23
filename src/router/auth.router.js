const Router = require("express").Router();
const authRouter = Router;

const validateSignupData = require("../utils/validation").validateSignupData;
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
    try {
        // validate data
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;

        // encrypt password
        const passwordHash = await bcrypt.hashSync(password, 10);

        console.log(passwordHash);

        const user = await User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        }).save();

        // offload token generation to user model
        const token = await user.getJWT();
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 8 * 3600000),
        });
        res.status(200).json({ message: "User created", user });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server error " + error.message });
    }
});

authRouter.post("/login", async (req, res) => {
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
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // offload token generation to user model
        const token = await user.getJWT();
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
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

authRouter.post("/logout", async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server error" + error.message });
    }
});

module.exports = { authRouter };
