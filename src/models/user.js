const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30,
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
            lowercase: true,
            required: true,
            index: true,
            unique: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is invalid");
                }
            },
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Password is not strong enough");
                }
            },
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            enum: {
                values: ["Male", "Female", "Other"],
                message: "{VALUE} is not supported",
            },
        },
        photoUrl: {
            type: String,
            default:
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
            validate(value) {
                if (value && !validator.isURL(value)) {
                    throw new Error("Photo URL is invalid");
                }
            },
        },
        about: {
            type: String,
            default: "Hey there! I am using this app.",
        },
        skills: {
            type: [String],
            validate(value) {
                if (value.length > 5) {
                    throw new Error("Skills cannot be more than 5");
                }
            },
        },
    },
    { timestamps: true }
);

// userSchema.index({ emailId: 1 }); // for faster search

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputUser) {
    const user = this;
    const passwordHashed = user.password;
    const isPasswordValid = await bcrypt.compare(
        passwordInputUser,
        passwordHashed
    );
    return isPasswordValid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
