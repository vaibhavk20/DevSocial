const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://vaibhav:vaibhavk20@cluster0.fvgv5hl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
};

module.exports = connectDB;
