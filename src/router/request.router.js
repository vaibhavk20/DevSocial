const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const Router = require("express").Router();
const requestRouter = Router;

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user.id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            // validateConnectionStatus(status);

            const allowedStatus = ["ignored", "interested"];

            if (!allowedStatus.includes(status)) {
                // throw new Error("Invalid status");
                return res
                    .status(400)
                    .json({ message: "Invalid status: " + status });
            }

            const toUser = await User.findOne({ _id: toUserId });
            if (!toUser) {
                return res.status(404).json({ message: "To user not found" });
            }

            const existingRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });
            if (existingRequest) {
                return res
                    .status(400)
                    .json({ message: "Request already exists" });
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });
            await connectionRequest.save();

            res.status(200).json({
                message: `${req.user.firstName} sent ${status} request to ${toUser.firstName}`,
                data: connectionRequest,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ message: "Server error : " + error.message });
        }
    }
);

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const { status, requestId } = req.params;
            const loggedInUser = req.user.id;

            const allowedStatus = ["accepted", "rejected"];

            if (!allowedStatus.includes(status)) {
                return res
                    .status(400)
                    .json({ message: "Invalid status: " + status });
            }
            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser,
                status: "interested",
            });

            if (!connectionRequest) {
                return res
                    .status(404)
                    .json({ message: "Connection request not found" });
            }

            connectionRequest.status = status;
            const data = await connectionRequest.save();

            res.status(200).json({
                message: `Request ${status} successfully`,
                data,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ message: "Server error : " + error.message });
        }
    }
);

module.exports = { requestRouter };
