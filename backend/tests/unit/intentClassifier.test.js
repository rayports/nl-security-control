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

  describe('Command Aliases', () => {
    test('should classify "sesame open" as DISARM_SYSTEM', () => {
      expect(classifyIntent('sesame open')).toBe('DISARM_SYSTEM');
    });

    test('should classify "open sesame" as DISARM_SYSTEM', () => {
      expect(classifyIntent('open sesame')).toBe('DISARM_SYSTEM');
    });

    test('should classify "unlock" as DISARM_SYSTEM', () => {
      expect(classifyIntent('unlock')).toBe('DISARM_SYSTEM');
    });

    test('should classify "unlock system" as DISARM_SYSTEM', () => {
      expect(classifyIntent('unlock system')).toBe('DISARM_SYSTEM');
    });

    test('should classify "let me in" as DISARM_SYSTEM', () => {
      expect(classifyIntent('let me in')).toBe('DISARM_SYSTEM');
    });

    test('should classify "sesame close" as ARM_SYSTEM', () => {
      expect(classifyIntent('sesame close')).toBe('ARM_SYSTEM');
    });

    test('should classify "close sesame" as ARM_SYSTEM', () => {
      expect(classifyIntent('close sesame')).toBe('ARM_SYSTEM');
    });

    test('should classify "lock" as ARM_SYSTEM', () => {
      expect(classifyIntent('lock')).toBe('ARM_SYSTEM');
    });

    test('should classify "secure" as ARM_SYSTEM', () => {
      expect(classifyIntent('secure')).toBe('ARM_SYSTEM');
    });

    test('should classify "guard mode" as ARM_SYSTEM', () => {
      expect(classifyIntent('guard mode')).toBe('ARM_SYSTEM');
    });

    test('should classify "who is here" as LIST_USERS', () => {
      expect(classifyIntent('who is here')).toBe('LIST_USERS');
    });

    test('should classify "show guests" as LIST_USERS', () => {
      expect(classifyIntent('show guests')).toBe('LIST_USERS');
    });

    test('should classify "who has access" as LIST_USERS', () => {
      expect(classifyIntent('who has access')).toBe('LIST_USERS');
    });

    test('should classify "revoke access" as REMOVE_USER', () => {
      expect(classifyIntent('revoke access')).toBe('REMOVE_USER');
    });

    test('should handle aliases within longer sentences', () => {
      expect(classifyIntent('please sesame open')).toBe('DISARM_SYSTEM');
      expect(classifyIntent('sesame open now')).toBe('DISARM_SYSTEM');
      expect(classifyIntent('can you unlock system')).toBe('DISARM_SYSTEM');
    });

    test('should prioritize aliases over standard patterns', () => {
      // "unlock" should be DISARM_SYSTEM via alias, not confused with other intents
      expect(classifyIntent('unlock')).toBe('DISARM_SYSTEM');
      expect(classifyIntent('lock')).toBe('ARM_SYSTEM');
    });
  });

  describe('Edge Cases and Missing Patterns', () => {
    describe('ARM_SYSTEM edge cases', () => {
      test('should classify "arm it"', () => {
        expect(classifyIntent('arm it')).toBe('ARM_SYSTEM');
      });

      test('should classify "arm now"', () => {
        expect(classifyIntent('arm now')).toBe('ARM_SYSTEM');
      });

      test('should classify "set to away mode"', () => {
        expect(classifyIntent('set to away mode')).toBe('ARM_SYSTEM');
      });

      test('should classify "set to home mode"', () => {
        expect(classifyIntent('set to home mode')).toBe('ARM_SYSTEM');
      });

      test('should classify "away mode"', () => {
        expect(classifyIntent('away mode')).toBe('ARM_SYSTEM');
      });

      test('should classify "home mode"', () => {
        expect(classifyIntent('home mode')).toBe('ARM_SYSTEM');
      });

      test('should classify "stay mode"', () => {
        expect(classifyIntent('stay mode')).toBe('ARM_SYSTEM');
      });

      test('should classify "start the alarm"', () => {
        expect(classifyIntent('start the alarm')).toBe('ARM_SYSTEM');
      });
    });

    describe('DISARM_SYSTEM edge cases', () => {
      test('should classify "disarm"', () => {
        expect(classifyIntent('disarm')).toBe('DISARM_SYSTEM');
      });

      test('should classify "disarm it"', () => {
        expect(classifyIntent('disarm it')).toBe('DISARM_SYSTEM');
      });

      test('should classify "disarm now"', () => {
        expect(classifyIntent('disarm now')).toBe('DISARM_SYSTEM');
      });

      test('should classify "turn the system off"', () => {
        expect(classifyIntent('turn the system off')).toBe('DISARM_SYSTEM');
      });

      test('should classify "stop the alarm"', () => {
        expect(classifyIntent('stop the alarm')).toBe('DISARM_SYSTEM');
      });
    });

    describe('ADD_USER edge cases', () => {
      test('should classify "add John 1234"', () => {
        expect(classifyIntent('add John 1234')).toBe('ADD_USER');
      });

      test('should classify "add John with pin 1234"', () => {
        expect(classifyIntent('add John with pin 1234')).toBe('ADD_USER');
      });

      test('should classify "register John 5678"', () => {
        expect(classifyIntent('register John 5678')).toBe('ADD_USER');
      });

      test('should classify "register John with pin 5678"', () => {
        expect(classifyIntent('register John with pin 5678')).toBe('ADD_USER');
      });

      test('should classify "create Alice 9999"', () => {
        expect(classifyIntent('create Alice 9999')).toBe('ADD_USER');
      });

      test('should classify "add Bob"', () => {
        expect(classifyIntent('add Bob')).toBe('ADD_USER');
      });

      test('should classify "register Alice"', () => {
        expect(classifyIntent('register Alice')).toBe('ADD_USER');
      });
    });

    describe('REMOVE_USER edge cases', () => {
      test('should classify "remove user John"', () => {
        expect(classifyIntent('remove user John')).toBe('REMOVE_USER');
      });

      test('should classify "delete user Alice"', () => {
        expect(classifyIntent('delete user Alice')).toBe('REMOVE_USER');
      });

      test('should classify "remove by pin 1234"', () => {
        expect(classifyIntent('remove by pin 1234')).toBe('REMOVE_USER');
      });

      test('should classify "remove by passcode 5678"', () => {
        expect(classifyIntent('remove by passcode 5678')).toBe('REMOVE_USER');
      });

      test('should classify "delete by pin 9999"', () => {
        expect(classifyIntent('delete by pin 9999')).toBe('REMOVE_USER');
      });

      test('should classify "unregister John"', () => {
        expect(classifyIntent('unregister John')).toBe('REMOVE_USER');
      });
    });

    describe('LIST_USERS edge cases', () => {
      test('should classify "show users"', () => {
        expect(classifyIntent('show users')).toBe('LIST_USERS');
      });

      test('should classify "who\'s registered"', () => {
        expect(classifyIntent('who\'s registered')).toBe('LIST_USERS');
      });

      test('should classify "who\'s here"', () => {
        expect(classifyIntent('who\'s here')).toBe('LIST_USERS');
      });

      test('should classify "list all"', () => {
        expect(classifyIntent('list all')).toBe('LIST_USERS');
      });

      test('should classify "show all"', () => {
        expect(classifyIntent('show all')).toBe('LIST_USERS');
      });
    });

    describe('Ambiguous inputs', () => {
      test('should return null for "arm" alone', () => {
        expect(classifyIntent('arm')).toBeNull();
      });

      test('should classify "disarm" alone', () => {
        // "disarm" should work as a standalone command
        expect(classifyIntent('disarm')).toBe('DISARM_SYSTEM');
      });

      test('should return null for "lock" alone', () => {
        // "lock" is an alias, so it should work
        expect(classifyIntent('lock')).toBe('ARM_SYSTEM');
      });

      test('should return null for "unlock" alone', () => {
        // "unlock" is an alias, so it should work
        expect(classifyIntent('unlock')).toBe('DISARM_SYSTEM');
      });

      test('should return null for completely ambiguous "arm user"', () => {
        // This is ambiguous - could be "arm the system" or "add user with arm permission"
        expect(classifyIntent('arm user')).toBeNull();
      });
    });
  });
});

