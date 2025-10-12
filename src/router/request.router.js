const Router = require("express").Router();
const requestRouter = Router;

requestRouter.post("/sendConnectionRequet", async (req, res) => {
    res.send("Request sent");
});

module.exports = { requestRouter };
