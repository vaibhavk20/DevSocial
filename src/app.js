const express = require("express");
const app = express();

app.use("/", (req, res) => {
    res.send("home page");
});

app.listen(3000, () => {
    console.log("server started: 3000");
});
