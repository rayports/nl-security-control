const VALID_MODES = ['away', 'home', 'stay'];

const createSystemState = (data) => {
  const { armed, mode } = data;

  // Validate armed
  if (typeof armed !== 'boolean') {
    throw new Error('armed must be a boolean');
  }

  // Validate mode
  if (!mode || typeof mode !== 'string' || !VALID_MODES.includes(mode)) {
    throw new Error(`mode must be one of: ${VALID_MODES.join(', ')}`);
  }

  return {
    armed,
    mode
  };
};

const getDefaultSystemState = () => {
  return {
    armed: false,
    mode: 'away'
  };
};

module.exports = {
  createSystemState,
  getDefaultSystemState
};

