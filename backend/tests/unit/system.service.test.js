const systemService = require('../../src/services/system.service');
const store = require('../../src/storage/inMemoryStore');

describe('system.service', () => {
  beforeEach(() => {
    // Reset system state to default before each test
    store.setSystemState({
      armed: false,
      mode: 'away'
    });
  });

  describe('armSystem', () => {
    test('should arm system with default mode "away"', () => {
      const state = systemService.armSystem();

      expect(state.armed).toBe(true);
      expect(state.mode).toBe('away');
    });

    test('should arm system with "home" mode', () => {
      const state = systemService.armSystem('home');

      expect(state.armed).toBe(true);
      expect(state.mode).toBe('home');
    });

    test('should arm system with "stay" mode', () => {
      const state = systemService.armSystem('stay');

      expect(state.armed).toBe(true);
      expect(state.mode).toBe('stay');
    });

    test('should reject invalid mode', () => {
      expect(() => {
        systemService.armSystem('invalid');
      }).toThrow('mode must be one of: away, home, stay');
    });

    test('should reject non-string mode', () => {
      expect(() => {
        systemService.armSystem(123);
      }).toThrow('mode must be one of: away, home, stay');
    });
  });

  describe('disarmSystem', () => {
    test('should disarm system correctly', () => {
      // First arm the system
      systemService.armSystem('home');

      // Then disarm
      const state = systemService.disarmSystem();

      expect(state.armed).toBe(false);
      expect(state.mode).toBe('home'); // Mode should be preserved
    });

    test('should preserve mode when disarming', () => {
      systemService.armSystem('stay');
      const state = systemService.disarmSystem();

      expect(state.armed).toBe(false);
      expect(state.mode).toBe('stay');
    });

    test('should disarm from default state', () => {
      const state = systemService.disarmSystem();

      expect(state.armed).toBe(false);
      expect(state.mode).toBe('away');
    });
  });

  describe('getSystemState', () => {
    test('should return initial default state', () => {
      const state = systemService.getSystemState();

      expect(state.armed).toBe(false);
      expect(state.mode).toBe('away');
    });

    test('should return updated state after arm', () => {
      systemService.armSystem('home');
      const state = systemService.getSystemState();

      expect(state.armed).toBe(true);
      expect(state.mode).toBe('home');
    });

    test('should return updated state after disarm', () => {
      systemService.armSystem('stay');
      systemService.disarmSystem();
      const state = systemService.getSystemState();

      expect(state.armed).toBe(false);
      expect(state.mode).toBe('stay');
    });

    test('should return state after multiple operations', () => {
      systemService.armSystem('home');
      expect(systemService.getSystemState().armed).toBe(true);

      systemService.disarmSystem();
      expect(systemService.getSystemState().armed).toBe(false);

      systemService.armSystem('away');
      const finalState = systemService.getSystemState();
      expect(finalState.armed).toBe(true);
      expect(finalState.mode).toBe('away');
    });
  });
});

