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

// routes
const userRoutes = require('./routes/users.routes');

// greeting route
app.get('/api', function (req, res) {
  res.json({ message: 'Welcome to the HMO API' });
});

// mount routes
app.use('/api/users', userRoutes);

// 404 fallback
app.use('/api/*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

// serve frontend
app.use(history());
const root = path.normalize(__dirname + '/..');
const client = path.join(root, 'client', 'dist');
app.use(express.static(client));

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

// start server
app.listen(port, function () {
  console.log(`Server running on port ${port}`);
  console.log(`API ready at http://localhost:${port}/api`);
});

module.exports = app;
