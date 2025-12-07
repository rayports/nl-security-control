const request = require('supertest');
const app = require('../../src/app');
const store = require('../../src/storage/inMemoryStore');

describe('NLP Routes', () => {
  beforeEach(() => {
    // Clear all users before each test
    const users = store.getUsers();
    users.forEach(user => {
      store.removeUser(user.name);
    });

    // Reset system state to default
    store.setSystemState({
      armed: false,
      mode: 'away'
    });
  });

  describe('POST /nl/execute', () => {
    test('should arm system via NL command', async () => {
      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'arm the system' });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('arm the system');
      expect(response.body.interpretation.intent).toBe('ARM_SYSTEM');
      expect(response.body.interpretation.entities.mode).toBe('away');

      expect(response.body.api_call).toEqual({
        endpoint: '/api/arm-system',
        method: 'POST',
        payload: { mode: 'away' }
      });

      expect(response.body.response.success).toBe(true);
      expect(response.body.response.state.armed).toBe(true);
      expect(response.body.response.state.mode).toBe('away');
    });

    test('should add user via NL command', async () => {
      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'add user John with pin 4321' });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('add user John with pin 4321');
      expect(response.body.interpretation.intent).toBe('ADD_USER');
      expect(response.body.interpretation.entities.name).toBe('John');
      expect(response.body.interpretation.entities.pin).toBe('****21'); // Masked PIN

      expect(response.body.api_call).toEqual({
        endpoint: '/api/add-user',
        method: 'POST',
        payload: {
          name: 'John',
          pin: '****21', // Masked PIN
          start_time: undefined,
          end_time: undefined,
          permissions: []
        }
      });

      expect(response.body.response.success).toBe(true);
      expect(response.body.response.user.name).toBe('John');
      expect(response.body.response.user.pin).toBe('****21'); // Masked PIN
      expect(response.body.response.user.pin).not.toBe('4321'); // Should not be raw PIN
    });

    test('should remove user via NL command', async () => {
      // Setup: Add a user first
      await request(app)
        .post('/nl/execute')
        .send({ text: 'add user John with pin 4321' });

      // Test: Remove the user
      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'remove user John' });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('remove user John');
      expect(response.body.interpretation.intent).toBe('REMOVE_USER');
      expect(response.body.interpretation.entities.name).toBe('John');

      expect(response.body.api_call).toEqual({
        endpoint: '/api/remove-user',
        method: 'POST',
        payload: {
          name: 'John'
        }
      });

      expect(response.body.response.success).toBe(true);
      expect(response.body.response.user.name).toBe('John');
      expect(response.body.response.user.pin).toBe('****21'); // Masked PIN

      // Verify user is actually removed
      const listResponse = await request(app).get('/api/list-users');
      expect(listResponse.body.users).toHaveLength(0);
    });

    test('should list users via NL command', async () => {
      // Setup: Add at least one user
      await request(app)
        .post('/nl/execute')
        .send({ text: 'add user Alice with pin 5678' });

      await request(app)
        .post('/nl/execute')
        .send({ text: 'add user Bob with pin 9999' });

      // Test: List users
      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'show me all users' });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('show me all users');
      expect(response.body.interpretation.intent).toBe('LIST_USERS');
      expect(response.body.interpretation.entities).toEqual({});

      expect(response.body.api_call).toEqual({
        endpoint: '/api/list-users',
        method: 'GET',
        payload: {}
      });

      expect(response.body.response.success).toBe(true);
      expect(response.body.response.users).toBeInstanceOf(Array);
      expect(response.body.response.users.length).toBeGreaterThanOrEqual(2);

      // Verify all PINs are masked
      response.body.response.users.forEach(user => {
        expect(user.pin).toMatch(/^\*\*\*\*\d{2}$/); // Format: ****XX
        expect(user.pin).not.toMatch(/^[0-9]{4}$/); // Should not be raw 4-digit PIN
      });

      // Verify specific users are present
      const userNames = response.body.response.users.map(u => u.name);
      expect(userNames).toContain('Alice');
      expect(userNames).toContain('Bob');
    });

    test('should add user via NL command using passcode', async () => {
      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'add user Charlie with passcode 2468' });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('add user Charlie with passcode 2468');
      expect(response.body.interpretation.intent).toBe('ADD_USER');
      expect(response.body.interpretation.entities.name).toBe('Charlie');
      expect(response.body.interpretation.entities.pin).toBe('****68'); // Masked PIN

      expect(response.body.api_call).toEqual({
        endpoint: '/api/add-user',
        method: 'POST',
        payload: {
          name: 'Charlie',
          pin: '****68', // Masked PIN
          start_time: undefined,
          end_time: undefined,
          permissions: []
        }
      });

      expect(response.body.response.success).toBe(true);
      expect(response.body.response.user.name).toBe('Charlie');
      expect(response.body.response.user.pin).toBe('****68'); // Masked PIN
      expect(response.body.response.user.pin).not.toBe('2468'); // Should not be raw PIN
    });

    test('should add user with permissions via NL command', async () => {
      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'add user Alice, she can arm and disarm the system with pin 5678' });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('add user Alice, she can arm and disarm the system with pin 5678');
      expect(response.body.interpretation.intent).toBe('ADD_USER');
      expect(response.body.interpretation.entities.name).toBe('Alice');
      expect(response.body.interpretation.entities.pin).toBe('****78'); // Masked PIN
      expect(response.body.interpretation.entities.permissions).toEqual(['arm', 'disarm']);

      expect(response.body.api_call).toEqual({
        endpoint: '/api/add-user',
        method: 'POST',
        payload: {
          name: 'Alice',
          pin: '****78', // Masked PIN
          start_time: undefined,
          end_time: undefined,
          permissions: ['arm', 'disarm']
        }
      });

      expect(response.body.response.success).toBe(true);
      expect(response.body.response.user.name).toBe('Alice');
      expect(response.body.response.user.pin).toBe('****78'); // Masked PIN
    });

    test('should disarm system via alias command "sesame open"', async () => {
      // First arm the system
      await request(app)
        .post('/nl/execute')
        .send({ text: 'arm the system' });

      // Then disarm using alias
      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'sesame open' });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('sesame open');
      expect(response.body.interpretation.intent).toBe('DISARM_SYSTEM');
      expect(response.body.api_call.endpoint).toBe('/api/disarm-system');
      expect(response.body.response.success).toBe(true);
      expect(response.body.response.state.armed).toBe(false);
    });

    test('should arm system via alias command "sesame close"', async () => {
      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'sesame close' });

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('sesame close');
      expect(response.body.interpretation.intent).toBe('ARM_SYSTEM');
      expect(response.body.api_call.endpoint).toBe('/api/arm-system');
      expect(response.body.response.success).toBe(true);
      expect(response.body.response.state.armed).toBe(true);
    });

    test('should disarm system via alias command "unlock"', async () => {
      // First arm the system
      await request(app)
        .post('/nl/execute')
        .send({ text: 'arm the system' });

      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'unlock' });

      expect(response.status).toBe(200);
      expect(response.body.interpretation.intent).toBe('DISARM_SYSTEM');
      expect(response.body.response.state.armed).toBe(false);
    });

    test('should list users via alias command "who is here"', async () => {
      // Add a user first
      await request(app)
        .post('/nl/execute')
        .send({ text: 'add user Bob with pin 1234' });

      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'who is here' });

      expect(response.status).toBe(200);
      expect(response.body.interpretation.intent).toBe('LIST_USERS');
      expect(response.body.api_call.endpoint).toBe('/api/list-users');
      expect(response.body.response.success).toBe(true);
      expect(response.body.response.users).toBeInstanceOf(Array);
      expect(response.body.response.users.length).toBeGreaterThan(0);
      // Verify PINs are masked
      response.body.response.users.forEach(user => {
        expect(user.pin).toMatch(/^\*\*\*\*\d{2}$/);
      });
    });

    test('should handle alias within longer sentence "please sesame open"', async () => {
      // First arm the system
      await request(app)
        .post('/nl/execute')
        .send({ text: 'arm the system' });

      const response = await request(app)
        .post('/nl/execute')
        .send({ text: 'please sesame open' });

      expect(response.status).toBe(200);
      expect(response.body.interpretation.intent).toBe('DISARM_SYSTEM');
      expect(response.body.response.state.armed).toBe(false);
    });
  });
});

