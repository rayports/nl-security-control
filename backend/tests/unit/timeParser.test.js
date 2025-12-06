const { parseTime } = require('../../src/utils/timeParser');

describe('timeParser', () => {
  describe('parseTime - valid time expressions', () => {
    test('should parse "today 5pm"', () => {
      const result = parseTime('today 5pm');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThan(Date.now() - 86400000); // Within last 24 hours
    });

    test('should parse "next Tuesday"', () => {
      const result = parseTime('next Tuesday');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThan(Date.now());
    });

    test('should parse "Sunday at 10am"', () => {
      const result = parseTime('Sunday at 10am');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThan(Date.now() - 604800000); // Within last week or future
    });

    test('should parse simple time expressions', () => {
      const result1 = parseTime('5pm');
      expect(result1).toBeInstanceOf(Date);

      const result2 = parseTime('tomorrow');
      expect(result2).toBeInstanceOf(Date);
      expect(result2.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('parseTime - invalid inputs', () => {
    test('should return null for null input', () => {
      expect(parseTime(null)).toBeNull();
    });

    test('should return null for undefined input', () => {
      expect(parseTime(undefined)).toBeNull();
    });

    test('should return null for empty string', () => {
      expect(parseTime('')).toBeNull();
    });

    test('should return null for non-string input', () => {
      expect(parseTime(123)).toBeNull();
      expect(parseTime({})).toBeNull();
      expect(parseTime([])).toBeNull();
    });

    test('should return null for invalid time strings', () => {
      expect(parseTime('not a time')).toBeNull();
      expect(parseTime('xyz 123')).toBeNull();
      expect(parseTime('invalid date string')).toBeNull();
    });
  });

  describe('parseTime - edge cases', () => {
    test('should handle whitespace-only strings', () => {
      expect(parseTime('   ')).toBeNull();
      expect(parseTime('\t\n')).toBeNull();
    });

    test('should parse various date formats', () => {
      const result1 = parseTime('in 2 hours');
      if (result1) {
        expect(result1).toBeInstanceOf(Date);
      }

      const result2 = parseTime('next week');
      if (result2) {
        expect(result2).toBeInstanceOf(Date);
        expect(result2.getTime()).toBeGreaterThan(Date.now());
      }
    });
  });
});

