const adminAuth = (req, res, next) => {
    let token = "xyz";
    if (token != "xyz") {
        res.status(400).send("unauthorized user");
    }
    console.log("admin auth checked.");
    next();
};

module.exports = {
    adminAuth,
};
