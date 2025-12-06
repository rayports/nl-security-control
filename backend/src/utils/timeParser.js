const chrono = require('chrono-node');

const parseTime = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const parsed = chrono.parseDate(text);
  return parsed || null;
};

module.exports = {
  parseTime
};

