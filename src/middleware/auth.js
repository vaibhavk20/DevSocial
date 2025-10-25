const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        // read token from cookies
        let token = req.cookies?.token;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized please login." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ;

        // console.log(decoded);
        // req.user = decoded;

        const { _id } = decoded;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
module.exports = {
    userAuth,
};
