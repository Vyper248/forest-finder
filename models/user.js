const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    aUsername: String
});

userSchema.plugin(passportLocalMongoose, {usernameLowerCase: true});

module.exports = mongoose.model("User", userSchema);
