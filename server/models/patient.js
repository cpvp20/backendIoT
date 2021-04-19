const mongoose = require('./database')

let patientSchema = mongoose.Schema({
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
        required: false
    },
    registered_date: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: false
    }
});

let Patient = mongoose.model('patients', patientSchema);

module.exports = Patient;