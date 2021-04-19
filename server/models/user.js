const mongoose = require('./database')

let userSchema = mongoose.Schema({
    patient_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    registered_date: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

let User = mongoose.model('users', userSchema);

module.exports = User;