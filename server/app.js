var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');

// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmoDB';
var port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .catch(function (err) {
    console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
    console.error(err.stack);
    process.exit(1);
  })
  .then(function () {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  });

// Create Express app
var app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.options('*', cors());
app.use(cors());

// IMPORT ROUTES
// HMO entity routers
const userRoutes = require('./routes/users.routes');
const branchingRoomRoutes = require('./routes/branchingroom.routes');

// API ROUTES
app.get('/api', function (req, res) {
  res.json({ message: 'Welcome to the HearMeOut (HMO) API!' });
});

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/branchingrooms',branchingRoomRoutes);


// Catch all 404 for unmatched API routes
app.use('/api/*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});
 
// FRONTEND SERVING 
app.use(history());
var root = path.normalize(__dirname + '/..');
var client = path.join(root, 'client', 'dist');
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
});

// SERVER START 
app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Express server listening on port ${port}, in ${env} mode`);
  console.log(`Backend API: http://localhost:${port}/api/`);
  console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;
