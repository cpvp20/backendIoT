const Patient = require('./../models/patient');

class PatientsController {
    getAll(req, res) {
        console.log("getting all");
        Patient.find()
            .then(patients => {
                res.statusCode = 200;
                res.send(patients);
            })
            .catch(reason => {
                console.log(reason);
                res.statusCode = 500;
                res.end();
            });
    }

    async create(req, res) {
        console.log("creating patient...");

        let newPatient = req.body;
        //save in DB
        newPatient.registered_date = new Date(); //today
        let patientDocument = Patient(newPatient);
        patientDocument.save()
            .then(patient => {
                res.statusCode = 200;
                res.send(patient);
            })
            .catch(reason => {
                res.statusCode = 500;
                console.log(reason);
                res.end();
            });

    }

    async update(req, res) {
        Patient.findOne({
                email: req.params.email
            })
            .then(patient => {
                patient.name = req.body.name;
                patient.last_name = req.body.last_name;
                patient.age = req.body.age;
                patient.save()
                    .then(patient => {
                        res.statusCode = 200;
                        res.send(patient);
                    })
                    .catch(reason => {
                        res.statusCode = 500;
                        console.log("error in saving");
                        console.log(reason);
                        res.end();
                    });

            })
            .catch(reason => {
                res.statusCode = 500;
                console.log("error in finding patient to edit");
                console.log(reason);
                res.end();
            });

    }

    getOne(req, res) {
        console.log("getting one patient");
        Patient.findOne({
                patient_id: req.params.patient_id
            })
            .then(patient => {
                res.statusCode = 200;
                res.send(patient);
            })
            .catch(reason => {
                res.statusCode = 500;
                console.log(reason);
                res.end();
            });
    }

    remove(req, res) {
        Patient.deleteOne({
                patient_id: req.params.patient_id
            })
            .then(patient => {
                res.statusCode = 200;
                res.send(patient);
            })
            .catch(reason => {
                res.statusCode = 500;
                console.log(reason);
                res.end();
            });
    }
}
module.exports = new PatientsController();