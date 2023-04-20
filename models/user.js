const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type : String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname:{
        type: String,
        required: true
    },
    createAt:{
        type: Date
    }
})

module.exports = mongoose.model('user', userSchema);