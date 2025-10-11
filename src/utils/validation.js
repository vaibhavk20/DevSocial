const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (
        !firstName ||
        firstName.trim().length < 3 ||
        firstName.trim().length > 30
    ) {
        throw new Error("First name must be between 3 and 30 characters");
    }

    if (
        lastName &&
        (lastName.trim().length < 3 || lastName.trim().length > 30)
    ) {
        throw new Error("Last name must be between 3 and 30 characters");
    }

    if (!email || !validator.isEmail(email)) {
        throw new Error("Email is invalid");
    }

    if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
};
module.exports = { validateSignupData };
