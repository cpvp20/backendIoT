const mongoose = require('./database')

let requestSchema = mongoose.Schema({
    patient_id: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

let Request = mongoose.model('requests', requestSchema);

module.exports = Request;