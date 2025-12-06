// In-memory data store
const users = new Map();
const systemState = {
  armed: false,
  mode: 'away'
};

const getUsers = () => {
  return Array.from(users.values());
};

const setUser = (nameOrPin, userObject) => {
  users.set(nameOrPin, userObject);
};

const removeUser = (nameOrPin) => {
  return users.delete(nameOrPin);
};

const getSystemState = () => {
  return { ...systemState };
};

const setSystemState = (newState) => {
  Object.assign(systemState, newState);
};

module.exports = {
  getUsers,
  setUser,
  removeUser,
  getSystemState,
  setSystemState
};

