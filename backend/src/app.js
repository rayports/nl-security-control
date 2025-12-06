const express = require('express');
const cors = require('cors');
const correlationId = require('./middleware/correlationId');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors());
app.use(correlationId);
app.use(requestLogger);

// Routes will be added here
app.get('/test-error', (req, res, next) => {
  const error = new Error('Test error message');
  error.status = 500;
  next(error);
});

app.use(errorHandler);

module.exports = app;

