const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

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
    if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Email is invalid");
    }

    if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
};

const validateEditProfileData = (req) => {
    const data = req.body;

    const allowedUpdates = [
        "firstName",
        "lastName",
        "age",
        "skills",
        "photoUrl",
        "about",
    ];

    const requestedUpdates = Object.keys(data).every((key) =>
        allowedUpdates.includes(key)
    );

    if (!requestedUpdates) {
        throw new Error("Invalid Edit!");
    }
};

const validateForgetPasswordData = (req) => {
    const data = req.body;

    const allowedUpdates = ["password"];

    const requestedUpdates = Object.keys(data).every((key) =>
        allowedUpdates.includes(key)
    );

    if (!requestedUpdates) {
        throw new Error("Invalid Edit!");
    }

    if (!data.password || !validator.isStrongPassword(data.password)) {
        throw new Error("Password is not strong enough");
    }
};

const validateConnectionStatus = (status) => {
    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
    }
};

module.exports = {
    validateSignupData,
    validateEditProfileData,
    validateForgetPasswordData,
    validateConnectionStatus,
};
