const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  // Log request with structured JSON
  logger.info({
    method: req.method,
    url: req.url,
    correlationId: req.correlationId
  });
  
  // Capture status code when response finishes
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      correlationId: req.correlationId
    });
  });
  
  next();
};

module.exports = requestLogger;

