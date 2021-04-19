const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const routes = require("./routes");
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
var cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();

app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
    swagger: "2.0",
    info: {
      "title": "API Documentation",
      "description": "API to handle users and patients",
      "version": "1.0.0",
      "servers": ["http://localhost:3000"],
      "contact": {
        "name": "Carolina"
      }
    }
  },
  apis: ['index.js', 'routes/users.js', 'routes/patients.js', 'routes/requests.js']
}

routes(app);

//swagger
const swaggerDoc = swaggerJSDoc(swaggerOptions);
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.listen(port, () => {
  console.log(`App is running in port ${port}`);
});