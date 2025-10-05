const express = require("express");
const app = express();

const { adminAuth } = require("./middleware/adminAuth");

// app.use("/admin", adminAuth);

app.get("/admin/login", (req, res) => {
    res.status(200).send("login sucessfull");
});

app.get("/admin/getAlldata", adminAuth, (req, res) => {
    try {
        res.status(200).send("login sucessfull");
    } catch (error) {
        console.log("fail to fetch the all data");
    }
});
app.get("/admin/login", (req, res) => {
    res.status(200).send("login sucessfull");
});

app.get(
    "/test",
    (req, res, next) => {
        console.log("test page 1");
        next();
    },
    (req, res, next) => {
        console.log("test page 2");
        next();
    },
    (req, res, next) => {
        res.send("test page 3");
        next();
    }
);
app.use("/", (err, req, res) => {
    if (err) {
        res.status(500).send("something went wrong!");
    }
});

app.listen(3000, () => {
    console.log("server started: 3000");
});
