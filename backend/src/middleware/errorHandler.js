const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.log(`Error [${req.correlationId}]: ${message}`);

  res.status(status).json({
    success: false,
    error: message,
    correlationId: req.correlationId
  });
};

module.exports = errorHandler;

