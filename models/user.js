const mongoose = require('./database')

let userSchema = mongoose.Schema({
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
    password: {
        type: String,
        required: true
    }, 
    patient_id: {
        type: Number,
        required: true
    },
    patient_name: {
        type: String,
        required: true
    },
    patient_last_name: {
        type: String,
        required: true
    },
    patient_age: {
        type: Number,
        required: false
    }
});

let User = mongoose.model('users', userSchema);

module.exports = User;