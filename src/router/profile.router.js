const Router = require("express").Router();
const profileRouter = Router;
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const {
    validateEditProfileData,
    validateForgetPasswordData,
} = require("../utils/validation");
const { encryptedPassword } = require("../utils/encryption");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({ message: "User fetched", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const userID = req.user._id;

        validateEditProfileData(req);
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();

        res.status(200).json({
            message: "User updated successfully!.",
            data: loggedInUser,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server error : " + error.message });
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        validateForgetPasswordData(req);
        const { password } = req.body;

        const passwordHash = await encryptedPassword(password);

        const loggedInUser = req.user;
        loggedInUser["password"] = passwordHash;
        await loggedInUser.save();

        res.status(200).json({ message: "User updated.", data: loggedInUser });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server error : " + error.message });
    }
});

profileRouter.delete("/user", async (req, res) => {
    try {
        const userID = req.body.userId;
        await User.findByIdAndDelete({ _id: userID });
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = { profileRouter };
