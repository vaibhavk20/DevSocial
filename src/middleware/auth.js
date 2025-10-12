const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        // read token from cookies
        let token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, "vabhavkale"); // ;

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
    auth,
};
