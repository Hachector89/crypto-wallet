const { Schema, model } = require("mongoose");


const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fiatCurrency: {
        type: Number,
        required: true
    },
    cryptoCurrency: {
        type: Number,
        required: true
    }
});

module.exports = model('DBUser', UserSchema);