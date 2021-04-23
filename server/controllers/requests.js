const Request = require('../models/request');

class RequestsController {
    getAll(req, res) {
        console.log("getting all");
        // Request.deleteMany({  }, function (err) {
        //   if(err) console.log(err);
        // console.log("Successful deletion");
        //});
        Request.find()
            .then(requests => {
                res.statusCode = 200;
                requests.forEach((e) => {
                    console.log(e.date_time.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }));
                })
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
        let requests = await Request.find();
        console.log(requests);
        let lastID = requests.length > 0 ? Math.max.apply(null, requests.map(item => item.request_id)) : 0; //si es el primero, el ulId sera 0
        console.log("ultimo ID: ", lastID);
        let newRequest = req.body;
        newRequest.date_time = new Date();
        newRequest.request_id = (lastID + 1);
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