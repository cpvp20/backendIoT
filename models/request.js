const mongoose = require('./database')

let requestSchema = mongoose.Schema({
    request_id: {
        type: Number,
        required: true
    },
    patient_id: {
        type: Number,
        required: true
    },
    date_time: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

let Request = mongoose.model('requests', requestSchema);

module.exports = Request;