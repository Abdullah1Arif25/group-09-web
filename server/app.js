const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const connectDB = require('./config/database');
const { port } = require('./config/config'); 

connectDB(); // connect to db

const app = express();

// basic middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());


// greeting route
app.get('/api', function (req, res) {
  res.json({ message: 'Welcome to the HMO API' });
});


// 404 fallback
app.use('/api/*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
  res.status(404).json({ message: 'Not Found' });
});

// FRONTEND SERVING 
// serve frontend
app.use(history());
var root = path.normalize(__dirname + '/..');
var client = path.join(root, 'client', 'dist');
const root = path.normalize(__dirname + '/..');
const client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// ERROR HANDLER
var env = app.get('env');
app.use(function (err, req, res, next) {
  console.error(err.stack);
  var err_res = {
    message: err.message,
    error: {},
  };
  if (env === 'development') {
    err_res.error = err.stack;
  }
  res.status(err.status || 500);
  res.json(err_res);
// error handler
const env = app.get('env');
app.use(function (err, req, res, next) {
  console.error(err.stack);
  const err_res = {
    message: err.message,
    error: env === 'development' ? err.stack : {}
  };
  res.status(err.status || 500).json(err_res);
});

// SERVER START 
app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Express server listening on port ${port}, in ${env} mode`);
  console.log(`Backend API: http://localhost:${port}/api/`);
  console.log(`Frontend (production): http://localhost:${port}/`);
// start server
app.listen(port, function () {
  console.log(`Server running on port ${port}`);
  console.log(`API ready at http://localhost:${port}/api`);
});

module.exports = app;
