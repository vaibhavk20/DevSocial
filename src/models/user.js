const mongoose = require("mongoose");
const validator = require("validator");

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
            enum: ["Male", "Female", "Other"],
            validate(value) {
                if (!["Male", "Female", "Other"].includes(value)) {
                    throw new Error("Gender must be Male,Female or Other");
                }
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

const User = mongoose.model("User", userSchema);

module.exports = User;
