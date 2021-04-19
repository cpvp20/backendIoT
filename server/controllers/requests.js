const Request = require('../models/request');

class RequestsController {
    getAll(req, res) {
        console.log("getting all");
        Request.find()
            .then(requests => {
                res.statusCode = 200;
                res.send(requests);
            })
            .catch(reason => {
                console.log(reason);
                res.statusCode = 500;
                res.end();
            });
    }

    async create(req, res) {
        console.log("creating req...");
        let newRequest = req.body;
        let requestDocument = Request(newRequest);
        requestDocument.save()
            .then(request => {
                res.statusCode = 200;
                res.send(request);
            })
            .catch(reason => {
                res.statusCode = 500;
                console.log(reason);
                res.end();
            });
    }
}


module.exports = new RequestsController();