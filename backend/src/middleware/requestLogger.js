const logger = require('../utils/logger');
const { maskPinForLog } = require('../utils/pinMasker');

// Helper to mask PINs in objects recursively
const maskPinsInObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => maskPinsInObject(item));
  }
  
  const masked = { ...obj };
  if (masked.pin && typeof masked.pin === 'string') {
    masked.pin = maskPinForLog(masked.pin);
  }
  
  // Recursively mask nested objects
  for (const key in masked) {
    if (masked[key] && typeof masked[key] === 'object') {
      masked[key] = maskPinsInObject(masked[key]);
    }
  }
  
  return masked;
};

const requestLogger = (req, res, next) => {
  // Log request with structured JSON (mask PINs if body is logged)
  const logData = {
    method: req.method,
    url: req.url,
    correlationId: req.correlationId
  };
  
  // If request body exists, mask PINs before logging
  if (req.body && Object.keys(req.body).length > 0) {
    logData.body = maskPinsInObject(req.body);
  }
  
  logger.info(logData);
  
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

