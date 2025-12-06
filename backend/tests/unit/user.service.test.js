const userService = require('../../src/services/user.service');
const store = require('../../src/storage/inMemoryStore');

describe('user.service', () => {
  beforeEach(() => {
    // Clear all users before each test
    const users = store.getUsers();
    users.forEach(user => {
      store.removeUser(user.name);
    });
  });

  describe('addUser', () => {
    test('should successfully add a valid user', () => {
      const user = userService.addUser({
        name: 'John',
        pin: '1234'
      });

      expect(user.name).toBe('John');
      expect(user.pin).toBe('****34');
      expect(user.start_time).toBeNull();
      expect(user.end_time).toBeNull();
      expect(user.permissions).toEqual([]);
    });

    test('should trim name when adding user', () => {
      const user = userService.addUser({
        name: '  Bob  ',
        pin: '5678'
      });

      expect(user.name).toBe('Bob');
    });

    test('should add user with optional fields', () => {
      const startTime = new Date('2024-01-01');
      const endTime = new Date('2024-12-31');
      const user = userService.addUser({
        name: 'Alice',
        pin: '9999',
        start_time: startTime,
        end_time: endTime,
        permissions: ['admin', 'user']
      });

      expect(user.name).toBe('Alice');
      expect(user.start_time).toEqual(startTime);
      expect(user.end_time).toEqual(endTime);
      expect(user.permissions).toEqual(['admin', 'user']);
    });

    test('should reject duplicate user by name', () => {
      userService.addUser({ name: 'John', pin: '1234' });

      expect(() => {
        userService.addUser({ name: 'John', pin: '5678' });
      }).toThrow('User with name "John" already exists');
    });

    test('should reject duplicate user by name (case insensitive)', () => {
      userService.addUser({ name: 'John', pin: '1234' });

      expect(() => {
        userService.addUser({ name: 'john', pin: '5678' });
      }).toThrow('User with name "john" already exists');
    });

    test('should reject duplicate user by PIN', () => {
      userService.addUser({ name: 'John', pin: '1234' });

      expect(() => {
        userService.addUser({ name: 'Bob', pin: '1234' });
      }).toThrow('User with PIN "1234" already exists');
    });

    test('should reject invalid PIN format', () => {
      expect(() => {
        userService.addUser({ name: 'John', pin: '123' });
      }).toThrow('PIN is required and must be exactly 4 digits');

      expect(() => {
        userService.addUser({ name: 'John', pin: '12345' });
      }).toThrow('PIN is required and must be exactly 4 digits');

      expect(() => {
        userService.addUser({ name: 'John', pin: 'abcd' });
      }).toThrow('PIN is required and must be exactly 4 digits');
    });

    test('should reject missing name', () => {
      expect(() => {
        userService.addUser({ pin: '1234' });
      }).toThrow('Name is required and must be a non-empty string');
    });

    test('should reject missing PIN', () => {
      expect(() => {
        userService.addUser({ name: 'John' });
      }).toThrow('PIN is required and must be exactly 4 digits');
    });

    test('should reject empty name', () => {
      expect(() => {
        userService.addUser({ name: '', pin: '1234' });
      }).toThrow('Name is required and must be a non-empty string');
    });
  });

  describe('removeUser', () => {
    beforeEach(() => {
      userService.addUser({ name: 'John', pin: '1234' });
      userService.addUser({ name: 'Alice', pin: '5678' });
    });

    test('should remove user by name', () => {
      const removed = userService.removeUser('John');

      expect(removed.name).toBe('John');
      expect(removed.pin).toBe('****34');

      const users = userService.getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].name).toBe('Alice');
    });

    test('should remove user by name (case insensitive)', () => {
      const removed = userService.removeUser('john');

      expect(removed.name).toBe('John');
    });

    test('should remove user by PIN', () => {
      const removed = userService.removeUser('1234');

      expect(removed.name).toBe('John');
      expect(removed.pin).toBe('****34');

      const users = userService.getUsers();
      expect(users).toHaveLength(1);
    });

    test('should error when user does not exist by name', () => {
      expect(() => {
        userService.removeUser('NonExistent');
      }).toThrow('User not found: NonExistent');
    });

    test('should error when user does not exist by PIN', () => {
      expect(() => {
        userService.removeUser('9999');
      }).toThrow('User not found: 9999');
    });
  });

  describe('getUsers', () => {
    test('should return empty array when no users exist', () => {
      const users = userService.getUsers();
      expect(users).toEqual([]);
    });

    test('should return list of users with masked PINs', () => {
      userService.addUser({ name: 'John', pin: '1234' });
      userService.addUser({ name: 'Alice', pin: '5678' });

      const users = userService.getUsers();

      expect(users).toHaveLength(2);
      expect(users[0].name).toBe('John');
      expect(users[0].pin).toBe('****34');
      expect(users[1].name).toBe('Alice');
      expect(users[1].pin).toBe('****78');
    });

    test('should mask PINs correctly for all users', () => {
      userService.addUser({ name: 'User1', pin: '0000' });
      userService.addUser({ name: 'User2', pin: '9999' });

      const users = userService.getUsers();

      users.forEach(user => {
        expect(user.pin).toMatch(/^\*\*\*\*\d{2}$/);
      });
    });
  });
});

