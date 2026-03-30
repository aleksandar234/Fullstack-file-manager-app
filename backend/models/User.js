const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, requred: true},
    role: {type: String, enum:["USER", "ADMIN"], default: "USER"}
});

const User = mongoose.model("User", userSchema);

module.exports = User;