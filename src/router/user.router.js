const Router = require("express").Router();
const userRouter = Router;
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

USER_SAFE_DATA = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "about",
    "age",
    "gender",
    "skill",
];

// const USER_SAFE_DATA = "firstName lastName photoURL about age gender";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        if (connectionRequests) {
            return res.status(200).json({
                message: "Connection requests fetched",
                data: connectionRequests,
            });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server error : " + error.message });
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId, status: "accepted" },
                { toUserId: loggedInUserId, status: "accepted" },
            ],
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((connection) => {
            if (
                connection.fromUserId._id.toString() ===
                loggedInUserId._id.toString()
            ) {
                return connection.toUserId;
            }
            return connection.fromUserId;
        });

        res.status(200).json({ message: "Connections fetched", data });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server error : " + error.message });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // fetch all users except logged in user
        // and users who have sent connection request to logged in user
        // and users to whom logged in user has sent connection request
        // and users who are already connected with logged in user
        // only fetch safe data
        // pagination
        // search
        // filter
        // sorting
        //

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
        }).select("fromUserId toUserId");

        // const excludedUserIds = connectionRequests.reduce((acc, curr) => {
        //     acc.push(curr.fromUserId);
        //     acc.push(curr.toUserId);
        //     return acc;
        // }, []);
        // excludedUserIds.push(loggedInUserId);

        const hideUserFromFeed = new Set();
        connectionRequests.forEach((request) => {
            hideUserFromFeed.add(request.fromUserId.toString());
            hideUserFromFeed.add(request.toUserId.toString());
        });
        hideUserFromFeed.add(loggedInUserId.toString());

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUserId } },
            ],
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        // const users = await User.find({
        //     $and: [
        //         { _id: { $nin: excludedUserIds } },
        //         { _id: { $ne: loggedInUserId } },
        //     ],
        // }).select(USER_SAFE_DATA);

        // const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
        //     USER_SAFE_DATA
        // );

        // const users = await User.find({ _id: { $ne: loggedInUserId } })
        //     .select(USER_SAFE_DATA)
        //     .limit(20)
        //     .skip(0);

        // const users = await User.find({ _id: { $ne: loggedInUserId } })
        //     .select(USER_SAFE_DATA)
        //     .sort({ firstName: 1 });

        // const users = await User.find({
        //     _id: { $ne: loggedInUserId },
        //     firstName: { $regex: "a", $options: "i" },
        // })
        //     .select(USER_SAFE_DATA)
        //     .limit(20)
        //     .skip(0)
        //     .sort({ firstName: 1 });

        // if (!users) {
        //     return res.status(401).json({ message: "No users found" });
        // }

        res.status(200).json({ message: "Users fetched", feed: users });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server error : " + error.message });
    }
});

module.exports = {
    userRouter,
};
