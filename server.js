const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

//cors
const cors = require('cors');
corsOptions = {
  origin: 'https://frontend-domotica.herokuapp.com'
};
app.use(cors(corsOptions));

//seguridad
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Request = require('./models/request');

//mail
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cpvp2020@gmail.com',
    pass: 'holasoycaro'
  }
});

//authMiddleware
async function authMiddleware(req, res, next) {
  token = req.headers['x-user-token']; // Validar el token 
  jwt.verify(token, 'secret', function (err, decoded) {
    if (err) {
      res.status(401);
      console.log("Token invalido");
      res.end("Token invalido");
    } else {
      console.log("decoded");
      console.log(decoded.email);
      console.log(decoded.patient_id);
      req.patient_id = decoded.patient_id;
      req.email = decoded.email;
      next();
    }
  });
}
//login
app.post('/login', async function (req, res) {
  User.findOne({
    email: req.body.email
  }, (err, data) => {
    if (err) {
      res.statusCode = 400;
      res.end("Credenciales incorrectas");
    } else {
      //comparar pswds
      if (bcrypt.compareSync(req.body.password, data.password)) {
        let token = jwt.sign({
          patient_id: data.patient_id,
          email: data.email
        }, 'secret');
        console.log("Usuario logueado con token");
        console.log("token");
        console.log(token);
        res.statusCode = 200;
        res.end(token);
      } else {
        res.statusCode = 400;
        res.end("Credenciales incorrectas");
      }
    }
  })
});

//crear un usuario
app.post('/users', async function (req, res) {
  console.log("creating...");
  let newUser = req.body;
  let sameEmailUser = await User.find({
    email: newUser.email
  });
  if (sameEmailUser.length > 0) {
    res.statusCode = 400;
    res.send('Ya existe un usuario con el mismo correo');
  } else {
    //save in DB
    //guardar hash en la base de datos como password
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    console.log(newUser.password);
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
});

//editar un usuario
app.put('/users/:email', authMiddleware, async function (req, res) {
  User.findOne({
      email: req.params.email
    })
    .then(user => {
      user.name = req.body.name;
      user.last_name = req.body.last_name;
      user.patient_name = req.body.patient_name;
      user.patient_last_name = req.body.patient_last_name;
      user.patient_age = req.body.patient_age;
      user.phone = req.body.phone;
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

});

//get un usuario
app.get('/users/:email', authMiddleware, (req, res) => {
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
});

//loggedin to get info del usuario logueado
app.get('/loggedIn', authMiddleware, (req, res) => {
  res.send({
    'email': req.email,
    'patient_id': req.patient_id
  });
});

//funcion que manda correo al usuario sobre la solicitud del paciente
async function sendMail(patient_id, type) {
  User.findOne({
      'patient_id': patient_id
    })
    .then(user => {
      var mailOptions = {
        from: 'cpvp2020@gmail.com',
        to: user.email,
        subject: 'Solicitud',
        text: 'Tu paciente hizo una solicitud de ' + type
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    })
    .catch(reason => {
      console.log("error in finding user");
      console.log(reason);
      res.end();
    });
}

//get all requests of this user's patient
app.get('/requests', authMiddleware, (req, res) => {
  Request.find({
      'patient_id': req.patient_id
    }).sort({
      date_time: 'desc'
    })
    .then(requests => {
      res.statusCode = 200;
      res.send(requests);
    })
    .catch(reason => {
      console.log(reason);
      res.statusCode = 500;
      res.end();
    });
});

//get all requests FOR TESTING ONLY
app.get('/allRequests', (req, res) => {
  Request.find({})
    .sort({
      date_time: 'desc'
    })
    .then(requests => {
      res.statusCode = 200;
      res.send(requests);
    })
    .catch(reason => {
      console.log(reason);
      res.statusCode = 500;
      res.end();
    });
});
//crear request (lo guarda en la BD y tambien manda la notificacion al usuario)
app.post('/requests', async (req, res) => {
  sendMail(req.body.patient_id, req.body.type);
  let requests = await Request.find();
  let lastID = requests.length > 0 ? Math.max.apply(null, requests.map(item => item.request_id)) : 0; //si es el primero, el ulId sera 0
  console.log("ultimo ID: ", lastID);
  let newRequest = {
    'type': req.body.type,
    'patient_id': req.body.patient_id
  };
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
      res.end(reason);
    });
});

app.listen(port, () => {
  console.log(`App is running in port ${port}`);
});