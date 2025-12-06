const { parseCommand } = require('../../src/services/nlp.service');

describe('nlp.service', () => {
  describe('parseCommand - ARM_SYSTEM', () => {
    test('should parse "arm the system to away mode"', () => {
      const result = parseCommand('arm the system to away mode');
      expect(result.intent).toBe('ARM_SYSTEM');
      expect(result.entities.mode).toBe('away');
    });

    test('should parse "arm the system" (default mode)', () => {
      const result = parseCommand('arm the system');
      expect(result.intent).toBe('ARM_SYSTEM');
      expect(result.entities.mode).toBe('away');
    });

    test('should parse "arm system in home mode"', () => {
      const result = parseCommand('arm system in home mode');
      expect(result.intent).toBe('ARM_SYSTEM');
      expect(result.entities.mode).toBe('home');
    });

    test('should parse "activate the system in stay mode"', () => {
      const result = parseCommand('activate the system in stay mode');
      expect(result.intent).toBe('ARM_SYSTEM');
      expect(result.entities.mode).toBe('stay');
    });
  });

  describe('parseCommand - DISARM_SYSTEM', () => {
    test('should parse "disarm the system"', () => {
      const result = parseCommand('disarm the system');
      expect(result.intent).toBe('DISARM_SYSTEM');
      expect(result.entities).toEqual({});
    });

    test('should parse "turn off the alarm"', () => {
      const result = parseCommand('turn off the alarm');
      expect(result.intent).toBe('DISARM_SYSTEM');
      expect(result.entities).toEqual({});
    });

    test('should parse "turn it off"', () => {
      const result = parseCommand('turn it off');
      expect(result.intent).toBe('DISARM_SYSTEM');
      expect(result.entities).toEqual({});
    });
  });

  describe('parseCommand - ADD_USER', () => {
    test('should parse "add user John with pin 4321"', () => {
      const result = parseCommand('add user John with pin 4321');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('John');
      expect(result.entities.pin).toBe('4321');
    });

    test('should parse "create user named Bob with pin 5678"', () => {
      const result = parseCommand('create user named Bob with pin 5678');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('Bob');
      expect(result.entities.pin).toBe('5678');
    });

    test('should parse "add user Alice pin 9999"', () => {
      const result = parseCommand('add user Alice pin 9999');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('Alice');
      expect(result.entities.pin).toBe('9999');
    });

    test('should parse "add user John with pin 1234 from 5pm"', () => {
      const result = parseCommand('add user John with pin 1234 from 5pm');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('John');
      expect(result.entities.pin).toBe('1234');
      expect(result.entities.start_time).toBeInstanceOf(Date);
    });

    test('should parse "add user John using passcode 1234"', () => {
      const result = parseCommand('add user John using passcode 1234');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('John');
      expect(result.entities.pin).toBe('1234');
    });

    test('should parse "add user Alice with passcode 5678"', () => {
      const result = parseCommand('add user Alice with passcode 5678');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('Alice');
      expect(result.entities.pin).toBe('5678');
    });

    test('should parse "add user Bob passcode 9999"', () => {
      const result = parseCommand('add user Bob passcode 9999');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('Bob');
      expect(result.entities.pin).toBe('9999');
    });

    test('should parse "add user Sarah 4321 passcode"', () => {
      const result = parseCommand('add user Sarah 4321 passcode');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('Sarah');
      expect(result.entities.pin).toBe('4321');
    });

    test('should parse "add user John, she can arm the system with pin 1234"', () => {
      const result = parseCommand('add user John, she can arm the system with pin 1234');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('John');
      expect(result.entities.pin).toBe('1234');
      expect(result.entities.permissions).toEqual(['arm']);
    });

    test('should parse "add user John, he can disarm the system with pin 1234"', () => {
      const result = parseCommand('add user John, he can disarm the system with pin 1234');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('John');
      expect(result.entities.pin).toBe('1234');
      expect(result.entities.permissions).toEqual(['disarm']);
    });

    test('should parse "add user John, make sure he can arm and disarm our system with pin 1234"', () => {
      const result = parseCommand('add user John, make sure he can arm and disarm our system with pin 1234');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('John');
      expect(result.entities.pin).toBe('1234');
      expect(result.entities.permissions).toEqual(['arm', 'disarm']);
    });

    test('should parse "add a temporary user Sarah, pin 5678 from today 5pm to Sunday 10am"', () => {
      const result = parseCommand('add a temporary user Sarah, pin 5678 from today 5pm to Sunday 10am');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('Sarah');
      expect(result.entities.pin).toBe('5678');
      expect(result.entities.start_time).toBeDefined();
      expect(result.entities.start_time).toBeInstanceOf(Date);
      expect(result.entities.end_time).toBeDefined();
      expect(result.entities.end_time).toBeInstanceOf(Date);
    });

    test('should parse narrative command "My mother-in-law is coming to stay for the weekend, make sure she can arm and disarm our system using passcode 1234"', () => {
      const result = parseCommand('My mother-in-law is coming to stay for the weekend, make sure she can arm and disarm our system using passcode 1234');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('mother-in-law');
      expect(result.entities.pin).toBe('1234');
      expect(result.entities.permissions).toEqual(['arm', 'disarm']);
    });

    test('should parse "add user John with pin 1234 from this weekend to next weekend"', () => {
      const result = parseCommand('add user John with pin 1234 from this weekend to next weekend');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('John');
      expect(result.entities.pin).toBe('1234');
      expect(result.entities.start_time).toBeInstanceOf(Date);
      expect(result.entities.end_time).toBeInstanceOf(Date);
      expect(result.entities.start_time.getTime()).toBeLessThan(result.entities.end_time.getTime());
      // Start should be a Saturday
      expect(result.entities.start_time.getDay()).toBe(6);
      // End should be a Sunday (end of next weekend)
      expect(result.entities.end_time.getDay()).toBe(0);
    });

    test('should parse "add user Alice with pin 9999 until next tuesday 5pm"', () => {
      const result = parseCommand('add user Alice with pin 9999 until next tuesday 5pm');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('Alice');
      expect(result.entities.pin).toBe('9999');
      expect(result.entities.end_time).toBeInstanceOf(Date);
      expect(result.entities.end_time.getTime()).toBeGreaterThan(Date.now());
      // Should be a Tuesday
      expect(result.entities.end_time.getDay()).toBe(2);
      // Should be around 5pm (17:00)
      expect(result.entities.end_time.getHours()).toBe(17);
    });

    test('should parse "add user Bob with pin 4321 this weekend"', () => {
      const result = parseCommand('add user Bob with pin 4321 this weekend');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('Bob');
      expect(result.entities.pin).toBe('4321');
      expect(result.entities.start_time).toBeInstanceOf(Date);
      expect(result.entities.end_time).toBeInstanceOf(Date);
      // Start should be Saturday
      expect(result.entities.start_time.getDay()).toBe(6);
      // End should be Sunday
      expect(result.entities.end_time.getDay()).toBe(0);
    });

    test('should parse "add user Sarah with pin 5678 until next christmas"', () => {
      const result = parseCommand('add user Sarah with pin 5678 until next christmas');
      expect(result.intent).toBe('ADD_USER');
      expect(result.entities.name).toBe('Sarah');
      expect(result.entities.pin).toBe('5678');
      expect(result.entities.end_time).toBeInstanceOf(Date);
      expect(result.entities.end_time.getTime()).toBeGreaterThan(Date.now());
      // Should be December 25
      expect(result.entities.end_time.getMonth()).toBe(11); // 11 = December
      expect(result.entities.end_time.getDate()).toBe(25);
    });
  });

  describe('parseCommand - REMOVE_USER', () => {
    test('should parse "remove user John"', () => {
      const result = parseCommand('remove user John');
      expect(result.intent).toBe('REMOVE_USER');
      expect(result.entities.name).toBe('John');
    });

    test('should parse "delete user named Bob"', () => {
      const result = parseCommand('delete user named Bob');
      expect(result.intent).toBe('REMOVE_USER');
      expect(result.entities.name).toBe('Bob');
    });

    test('should parse "remove John"', () => {
      const result = parseCommand('remove John');
      expect(result.intent).toBe('REMOVE_USER');
      expect(result.entities.name).toBe('John');
    });
  });

  describe('parseCommand - LIST_USERS', () => {
    test('should parse "show me all users"', () => {
      const result = parseCommand('show me all users');
      expect(result.intent).toBe('LIST_USERS');
      expect(result.entities).toEqual({});
    });

    test('should parse "list all users"', () => {
      const result = parseCommand('list all users');
      expect(result.intent).toBe('LIST_USERS');
      expect(result.entities).toEqual({});
    });

    test('should parse "who are the users"', () => {
      const result = parseCommand('who are the users');
      expect(result.intent).toBe('LIST_USERS');
      expect(result.entities).toEqual({});
    });
  });

  describe('parseCommand - Error cases', () => {
    test('should throw error for null input', () => {
      expect(() => parseCommand(null)).toThrow('Text input is required');
    });

    test('should throw error for undefined input', () => {
      expect(() => parseCommand(undefined)).toThrow('Text input is required');
    });

    test('should throw error for empty string', () => {
      expect(() => parseCommand('')).toThrow('Text input is required');
    });

    test('should throw error for non-string input', () => {
      expect(() => parseCommand(123)).toThrow('Text input is required');
    });

    test('should throw error for unknown command', () => {
      expect(() => parseCommand('this is not a valid command')).toThrow('Could not determine intent from command');
    });

    test('should throw error for invalid text', () => {
      expect(() => parseCommand('hello world')).toThrow('Could not determine intent from command');
    });
  });
});

