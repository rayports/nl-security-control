const createUser = (data) => {
  const { name, pin, start_time = null, end_time = null, permissions = [] } = data;

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Name is required and must be a non-empty string');
  }

  if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
    throw new Error('PIN is required and must be exactly 4 digits');
  }

  // Validate optional fields
  if (start_time !== null && !(start_time instanceof Date)) {
    throw new Error('start_time must be a Date object or null');
  }

  if (end_time !== null && !(end_time instanceof Date)) {
    throw new Error('end_time must be a Date object or null');
  }

  // Validate time relationships
  const now = new Date();
  
  // If both times are provided, validate start < end
  if (start_time !== null && end_time !== null) {
    if (start_time.getTime() >= end_time.getTime()) {
      throw new Error('start_time must be before end_time');
    }
  }

  // Validate that times are in the future (for temporary users)
  // Only validate if at least one time is provided (indicating a temporary user)
  if (start_time !== null || end_time !== null) {
    if (start_time !== null && start_time.getTime() < now.getTime()) {
      throw new Error('start_time must be in the future for temporary users');
    }
    if (end_time !== null && end_time.getTime() < now.getTime()) {
      throw new Error('end_time must be in the future for temporary users');
    }
  }

  if (!Array.isArray(permissions)) {
    throw new Error('permissions must be an array');
  }

  return {
    name: name.trim(),
    pin,
    start_time,
    end_time,
    permissions
  };
};

module.exports = {
  createUser
};

