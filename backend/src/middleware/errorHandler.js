const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error with structured JSON
  logger.error({
    message: message,
    stack: err.stack,
    correlationId: req.correlationId
  });

  res.status(status).json({
    success: false,
    error: message,
    correlationId: req.correlationId
  });
};

module.exports = errorHandler;

