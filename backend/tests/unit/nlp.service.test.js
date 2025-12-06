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

