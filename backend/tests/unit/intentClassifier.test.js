const { classifyIntent } = require('../../src/services/intentClassifier');

describe('intentClassifier', () => {
  describe('ARM_SYSTEM', () => {
    test('should classify "arm the system"', () => {
      expect(classifyIntent('arm the system')).toBe('ARM_SYSTEM');
    });

    test('should classify "arm system"', () => {
      expect(classifyIntent('arm system')).toBe('ARM_SYSTEM');
    });

    test('should classify "turn on the alarm"', () => {
      expect(classifyIntent('turn on the alarm')).toBe('ARM_SYSTEM');
    });

    test('should classify "turn on the system"', () => {
      expect(classifyIntent('turn on the system')).toBe('ARM_SYSTEM');
    });

    test('should classify "activate the alarm"', () => {
      expect(classifyIntent('activate the alarm')).toBe('ARM_SYSTEM');
    });

    test('should classify "enable the system"', () => {
      expect(classifyIntent('enable the system')).toBe('ARM_SYSTEM');
    });

    test('should classify "set the alarm to armed"', () => {
      expect(classifyIntent('set the alarm to armed')).toBe('ARM_SYSTEM');
    });
  });

  describe('DISARM_SYSTEM', () => {
    test('should classify "disarm the system"', () => {
      expect(classifyIntent('disarm the system')).toBe('DISARM_SYSTEM');
    });

    test('should classify "disarm system"', () => {
      expect(classifyIntent('disarm system')).toBe('DISARM_SYSTEM');
    });

    test('should classify "turn off the alarm"', () => {
      expect(classifyIntent('turn off the alarm')).toBe('DISARM_SYSTEM');
    });

    test('should classify "turn off the system"', () => {
      expect(classifyIntent('turn off the system')).toBe('DISARM_SYSTEM');
    });

    test('should classify "turn it off"', () => {
      expect(classifyIntent('turn it off')).toBe('DISARM_SYSTEM');
    });

    test('should classify "deactivate the alarm"', () => {
      expect(classifyIntent('deactivate the alarm')).toBe('DISARM_SYSTEM');
    });

    test('should classify "disable the system"', () => {
      expect(classifyIntent('disable the system')).toBe('DISARM_SYSTEM');
    });

    test('should classify "shut off the alarm"', () => {
      expect(classifyIntent('shut off the alarm')).toBe('DISARM_SYSTEM');
    });

    test('should NOT classify "disarm" as ARM_SYSTEM', () => {
      expect(classifyIntent('disarm the system')).toBe('DISARM_SYSTEM');
      expect(classifyIntent('disarm the system')).not.toBe('ARM_SYSTEM');
    });
  });

  describe('ADD_USER', () => {
    test('should classify "add user"', () => {
      expect(classifyIntent('add user')).toBe('ADD_USER');
    });

    test('should classify "add a user"', () => {
      expect(classifyIntent('add a user')).toBe('ADD_USER');
    });

    test('should classify "create user"', () => {
      expect(classifyIntent('create user')).toBe('ADD_USER');
    });

    test('should classify "create a user"', () => {
      expect(classifyIntent('create a user')).toBe('ADD_USER');
    });

    test('should classify "register user"', () => {
      expect(classifyIntent('register user')).toBe('ADD_USER');
    });

    test('should classify "new user"', () => {
      expect(classifyIntent('new user')).toBe('ADD_USER');
    });
  });

  describe('REMOVE_USER', () => {
    test('should classify "remove user"', () => {
      expect(classifyIntent('remove user')).toBe('REMOVE_USER');
    });

    test('should classify "remove a user"', () => {
      expect(classifyIntent('remove a user')).toBe('REMOVE_USER');
    });

    test('should classify "delete user"', () => {
      expect(classifyIntent('delete user')).toBe('REMOVE_USER');
    });

    test('should classify "unregister user"', () => {
      expect(classifyIntent('unregister user')).toBe('REMOVE_USER');
    });

    test('should classify "drop user"', () => {
      expect(classifyIntent('drop user')).toBe('REMOVE_USER');
    });

    test('should classify "remove John"', () => {
      expect(classifyIntent('remove John')).toBe('REMOVE_USER');
    });

    test('should classify "delete Bob"', () => {
      expect(classifyIntent('delete Bob')).toBe('REMOVE_USER');
    });
  });

  describe('LIST_USERS', () => {
    test('should classify "list users"', () => {
      expect(classifyIntent('list users')).toBe('LIST_USERS');
    });

    test('should classify "list all users"', () => {
      expect(classifyIntent('list all users')).toBe('LIST_USERS');
    });

    test('should classify "show me all users"', () => {
      expect(classifyIntent('show me all users')).toBe('LIST_USERS');
    });

    test('should classify "show all users"', () => {
      expect(classifyIntent('show all users')).toBe('LIST_USERS');
    });

    test('should classify "get all users"', () => {
      expect(classifyIntent('get all users')).toBe('LIST_USERS');
    });

    test('should classify "display all users"', () => {
      expect(classifyIntent('display all users')).toBe('LIST_USERS');
    });

    test('should classify "who are the users"', () => {
      expect(classifyIntent('who are the users')).toBe('LIST_USERS');
    });

    test('should classify "users list"', () => {
      expect(classifyIntent('users list')).toBe('LIST_USERS');
    });
  });

  describe('Invalid/Unknown inputs', () => {
    test('should return null for null input', () => {
      expect(classifyIntent(null)).toBeNull();
    });

    test('should return null for undefined input', () => {
      expect(classifyIntent(undefined)).toBeNull();
    });

    test('should return null for empty string', () => {
      expect(classifyIntent('')).toBeNull();
    });

    test('should return null for non-string input', () => {
      expect(classifyIntent(123)).toBeNull();
      expect(classifyIntent({})).toBeNull();
    });

    test('should return null for unknown commands', () => {
      expect(classifyIntent('this is not a valid command')).toBeNull();
      expect(classifyIntent('hello world')).toBeNull();
      expect(classifyIntent('what time is it')).toBeNull();
    });
  });
});

