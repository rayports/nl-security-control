const { createSystemState } = require('../models/SystemState');
const store = require('../storage/inMemoryStore');

const armSystem = (mode = 'away') => {
  // Validate mode and create system state
  const newState = createSystemState({ armed: true, mode });
  
  // Update store
  store.setSystemState(newState);
  
  return store.getSystemState();
};

const disarmSystem = () => {
  const currentState = store.getSystemState();
  
  // Set armed to false, keep current mode
  store.setSystemState({
    armed: false,
    mode: currentState.mode
  });
  
  return store.getSystemState();
};

const getSystemState = () => {
  return store.getSystemState();
};

module.exports = {
  armSystem,
  disarmSystem,
  getSystemState
};

