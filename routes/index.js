const usersRoutes = require('./users');
const patientsRoutes = require('./patients');
const requestsRoutes = require('./requests');

module.exports = function (app) {
  app.use('/users', usersRoutes);
  app.use('/patients', patientsRoutes);
  app.use('/requests', requestsRoutes);

  app.get("/", (req, res) => {
    res.end('Hi from the backend');
});
}