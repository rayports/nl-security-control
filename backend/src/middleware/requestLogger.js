const requestLogger = (req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Correlation ID: ${req.correlationId}`);
  next();
};

module.exports = requestLogger;

