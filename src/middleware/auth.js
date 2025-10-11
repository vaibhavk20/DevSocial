const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        // read token from cookies
        let token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, "vabhavkale"); // ;

        console.log(decoded);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
module.exports = {
    auth,
};
