const User = require('./../models/user');

class UsersController {
    getAll(req, res) {
        console.log("getting all");
        User.find()
            .then(users => {
                res.statusCode = 200;
                res.send(users);
            })
            .catch(reason => {
                console.log(reason);
                res.statusCode = 500;
                res.end();
            });
    }

    async create(req, res) {
        console.log("creating...");

        let newUser = req.body;

        // Validar if this is an existing user (by email or name)
        let sameEmailUser = await User.find({
            email: newUser.email
        });
        let sameNameAndLastName = await User.find({
            name: newUser.name,
            last_name: newUser.last_name
        });

        if (sameEmailUser.length > 0) {
            res.statusCode = 400;
            res.send('This email is already registered');
        } else if (sameNameAndLastName.length > 0) {
            res.statusCode = 400;
            res.send('This name is already registered');
        } else {
            //save in DB
            newUser.registered_date = new Date(); //today
            console.log(newUser.registered_date);
            let userDocument = User(newUser);
            userDocument.save()
                .then(user => {
                    res.statusCode = 200;
                    res.send(user);
                })
                .catch(reason => {
                    res.statusCode = 500;
                    console.log(reason);
                    res.end();
                });
        }
    }

    async update(req, res) {
        //email CANNOT BE EDITED
        let sameNameAndLastName = await User.findOne({
            name: req.body.name,
            last_name: req.body.last_name
        });
        if (sameNameAndLastName && sameNameAndLastName.email != req.params.email) {
            res.statusCode = 400;
            res.end('This name is already registered');
            return;
        }
        User.findOne({
                email: req.params.email
            })
            .then(user => {
                user.name = req.body.name;
                user.last_name = req.body.last_name;
                user.password = req.body.password;
                user.age = req.body.age;
                user.profileURL = req.body.profileURL;
                user.save()
                    .then(user => {
                        res.statusCode = 200;
                        res.send(user);
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
                console.log("error in finding user to edit");
                console.log(reason);
                res.end();
            });

    }

    getOne(req, res) {
        console.log("getting one user");
        User.findOne({
                email: req.params.email
            })
            .then(user => {
                res.statusCode = 200;
                res.send(user);
            })
            .catch(reason => {
                res.statusCode = 500;
                console.log(reason);
                res.end();
            });
    }

    remove(req, res) {
        User.deleteOne({
                email: req.params.email
            })
            .then(user => {
                res.statusCode = 200;
                res.send(user);
            })
            .catch(reason => {
                res.statusCode = 500;
                console.log(reason);
                res.end();
            });
    }
}


module.exports = new UsersController();