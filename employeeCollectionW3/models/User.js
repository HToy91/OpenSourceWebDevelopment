// npm install passport passport-local express-session connect-mongo bcrypt --save

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    passwordHash: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema); // Export the User model