const bcrypt = require("bcrypt");
const encryptedPassword = async function (password) {
    const passwordHashed = bcrypt.hashSync(password, 10);
    return passwordHashed;
};

module.exports = { encryptedPassword };
