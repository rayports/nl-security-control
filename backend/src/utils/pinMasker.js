const maskPinForResponse = (pin) => {
  if (!pin || typeof pin !== 'string' || pin.length < 2) {
    return '****';
  }
  const lastTwo = pin.slice(-2);
  return `****${lastTwo}`;
};

const maskPinForLog = (pin) => {
  if (!pin || typeof pin !== 'string') {
    return '****';
  }
  return '****';
};

module.exports = {
  maskPinForResponse,
  maskPinForLog
};

