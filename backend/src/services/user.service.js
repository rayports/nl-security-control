const { createUser } = require('../models/User');
const store = require('../storage/inMemoryStore');
const { maskPinForResponse } = require('../utils/pinMasker');

const addUser = (data) => {
  // Validate and create user using model
  const user = createUser(data);

  // Check for duplicate by name
  const existingUsers = store.getUsers();
  const duplicateByName = existingUsers.find(u => u.name.toLowerCase() === user.name.toLowerCase());
  if (duplicateByName) {
    throw new Error(`User with name "${user.name}" already exists`);
  }

  // Check for duplicate by PIN
  const duplicateByPin = existingUsers.find(u => u.pin === user.pin);
  if (duplicateByPin) {
    throw new Error(`User with PIN "${user.pin}" already exists`);
  }

  // Store user keyed by name
  store.setUser(user.name, user);

  // Return user with masked PIN
  return {
    ...user,
    pin: maskPinForResponse(user.pin)
  };
};

const removeUser = (identifier) => {
  const users = store.getUsers();
  
  // Try to find by name first
  let userToRemove = users.find(u => u.name.toLowerCase() === identifier.toLowerCase());
  
  // If not found by name, try by PIN
  if (!userToRemove) {
    userToRemove = users.find(u => u.pin === identifier);
  }

  if (!userToRemove) {
    throw new Error(`User not found: ${identifier}`);
  }

  // Remove by name (since that's how we key the store)
  const removed = store.removeUser(userToRemove.name);
  
  if (!removed) {
    throw new Error(`Failed to remove user: ${identifier}`);
  }

  return {
    ...userToRemove,
    pin: maskPinForResponse(userToRemove.pin)
  };
};

const getUsers = () => {
  const users = store.getUsers();
  
  // Return users with masked PINs
  return users.map(user => ({
    ...user,
    pin: maskPinForResponse(user.pin)
  }));
};

module.exports = {
  addUser,
  removeUser,
  getUsers
};

