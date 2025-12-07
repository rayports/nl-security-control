const logger = require('../utils/logger');
const { maskPinForLog } = require('../utils/pinMasker');

// Helper to mask PINs in error messages
const maskPinsInString = (str) => {
  if (!str || typeof str !== 'string') {
    return str;
  }
  // Replace 4-digit PINs in error messages with masked version
  return str.replace(/\b\d{4}\b/g, (match) => {
    // Only mask if it looks like a PIN (4 digits)
    return maskPinForLog(match);
  });
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Mask PINs in error message before logging
  const maskedMessage = maskPinsInString(message);
  const maskedStack = err.stack ? maskPinsInString(err.stack) : undefined;

  // Log error with structured JSON (PINs masked)
  logger.error({
    message: maskedMessage,
    stack: maskedStack,
    correlationId: req.correlationId
  });

  // Don't expose PINs in error response either
  const safeMessage = maskPinsInString(message);

  res.status(status).json({
    success: false,
    error: safeMessage,
    correlationId: req.correlationId
  });
};

module.exports = errorHandler;

