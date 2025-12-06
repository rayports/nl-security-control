const { maskPinForResponse, maskPinForLog } = require('../../src/utils/pinMasker');

describe('pinMasker', () => {
  describe('maskPinForResponse', () => {
    test('should mask 4-digit PIN showing last 2 digits', () => {
      expect(maskPinForResponse('1234')).toBe('****34');
      expect(maskPinForResponse('5678')).toBe('****78');
      expect(maskPinForResponse('0000')).toBe('****00');
      expect(maskPinForResponse('9999')).toBe('****99');
    });

    test('should handle PINs longer than 4 digits', () => {
      expect(maskPinForResponse('12345')).toBe('****45');
      expect(maskPinForResponse('123456')).toBe('****56');
    });

    test('should return full mask for PINs shorter than 2 characters', () => {
      expect(maskPinForResponse('1')).toBe('****');
      expect(maskPinForResponse('')).toBe('****');
    });

    test('should return full mask for null or undefined', () => {
      expect(maskPinForResponse(null)).toBe('****');
      expect(maskPinForResponse(undefined)).toBe('****');
    });

    test('should return full mask for non-string inputs', () => {
      expect(maskPinForResponse(1234)).toBe('****');
      expect(maskPinForResponse({})).toBe('****');
      expect(maskPinForResponse([])).toBe('****');
    });
  });

  describe('maskPinForLog', () => {
    test('should fully mask any valid PIN', () => {
      expect(maskPinForLog('1234')).toBe('****');
      expect(maskPinForLog('5678')).toBe('****');
      expect(maskPinForLog('0000')).toBe('****');
      expect(maskPinForLog('9999')).toBe('****');
    });

    test('should handle PINs of any length', () => {
      expect(maskPinForLog('12')).toBe('****');
      expect(maskPinForLog('12345')).toBe('****');
      expect(maskPinForLog('1234567890')).toBe('****');
    });

    test('should return full mask for null or undefined', () => {
      expect(maskPinForLog(null)).toBe('****');
      expect(maskPinForLog(undefined)).toBe('****');
    });

    test('should return full mask for empty string', () => {
      expect(maskPinForLog('')).toBe('****');
    });

    test('should return full mask for non-string inputs', () => {
      expect(maskPinForLog(1234)).toBe('****');
      expect(maskPinForLog({})).toBe('****');
      expect(maskPinForLog([])).toBe('****');
    });
  });
});

