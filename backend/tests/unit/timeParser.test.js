const { parseTime, parseWeekendRange } = require('../../src/utils/timeParser');

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

    test('should parse "next tuesday 5pm"', () => {
      const result = parseTime('next tuesday 5pm');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThan(Date.now());
      // Verify it's a Tuesday
      expect(result.getDay()).toBe(2); // 2 = Tuesday
      // Verify it's around 5pm (17:00)
      expect(result.getHours()).toBe(17);
    });

    test('should parse "Sunday at 10am"', () => {
      const result = parseTime('Sunday at 10am');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThan(Date.now() - 604800000); // Within last week or future
    });

    test('should parse "next christmas"', () => {
      const result = parseTime('next christmas');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThan(Date.now());
      // Verify it's December 25
      expect(result.getMonth()).toBe(11); // 11 = December (0-indexed)
      expect(result.getDate()).toBe(25);
    });

    test('should parse "this weekend"', () => {
      const result = parseTime('this weekend');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThanOrEqual(Date.now());
      // Should be a Saturday
      expect(result.getDay()).toBe(6); // 6 = Saturday
      // Should be at midnight (00:00:00)
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    test('should parse "next weekend"', () => {
      const result = parseTime('next weekend');
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThan(Date.now());
      // Should be a Saturday
      expect(result.getDay()).toBe(6); // 6 = Saturday
      // Should be at midnight (00:00:00)
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
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

  describe('parseWeekendRange', () => {
    test('should parse "this weekend" range', () => {
      const result = parseWeekendRange('this weekend');
      expect(result).not.toBeNull();
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
      expect(result.start.getTime()).toBeLessThan(result.end.getTime());
      // Start should be Saturday
      expect(result.start.getDay()).toBe(6);
      // End should be Sunday
      expect(result.end.getDay()).toBe(0);
      // Start should be at midnight
      expect(result.start.getHours()).toBe(0);
      // End should be at 23:59:59
      expect(result.end.getHours()).toBe(23);
      expect(result.end.getMinutes()).toBe(59);
    });

    test('should parse "next weekend" range', () => {
      const result = parseWeekendRange('next weekend');
      expect(result).not.toBeNull();
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
      expect(result.start.getTime()).toBeLessThan(result.end.getTime());
      expect(result.start.getTime()).toBeGreaterThan(Date.now());
      // Start should be Saturday
      expect(result.start.getDay()).toBe(6);
      // End should be Sunday
      expect(result.end.getDay()).toBe(0);
    });

    test('should return null for invalid weekend expressions', () => {
      expect(parseWeekendRange('this week')).toBeNull();
      expect(parseWeekendRange('weekend')).toBeNull();
      expect(parseWeekendRange('')).toBeNull();
      expect(parseWeekendRange(null)).toBeNull();
    });
  });
});

