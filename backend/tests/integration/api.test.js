const request = require('supertest');
const app = require('../../src/app');
const store = require('../../src/storage/inMemoryStore');

describe('API Routes', () => {
  beforeEach(() => {
    // Clear all users before each test
    const users = store.getUsers();
    users.forEach(user => {
      store.removeUser(user.name);
    });
  });

  describe('User Management Flow', () => {
    test('should add user, list users, and remove user', async () => {
      // Step 1: Add a user
      const addResponse = await request(app)
        .post('/api/add-user')
        .send({
          name: 'John',
          pin: '1234'
        });

      expect(addResponse.status).toBe(201);
      expect(addResponse.body.success).toBe(true);
      expect(addResponse.body.user).toBeDefined();
      expect(addResponse.body.user.name).toBe('John');
      expect(addResponse.body.user.pin).toBe('****34'); // PIN should be masked
      expect(addResponse.body.user.pin).not.toBe('1234'); // Should not be raw PIN

      // Step 2: List users
      const listResponse = await request(app).get('/api/list-users');

      expect(listResponse.status).toBe(200);
      expect(listResponse.body.success).toBe(true);
      expect(listResponse.body.users).toBeInstanceOf(Array);
      expect(listResponse.body.users).toHaveLength(1);
      expect(listResponse.body.users[0].name).toBe('John');
      expect(listResponse.body.users[0].pin).toBe('****34'); // PIN should be masked
      expect(listResponse.body.users[0].pin).toMatch(/^\*\*\*\*\d{2}$/); // Format: ****XX

      // Step 3: Remove the user
      const removeResponse = await request(app)
        .post('/api/remove-user')
        .send({
          identifier: 'John'
        });

      expect(removeResponse.status).toBe(200);
      expect(removeResponse.body.success).toBe(true);
      expect(removeResponse.body.user).toBeDefined();
      expect(removeResponse.body.user.name).toBe('John');
      expect(removeResponse.body.user.pin).toBe('****34'); // PIN should be masked

      // Step 4: Verify user is removed
      const listAfterRemove = await request(app).get('/api/list-users');
      expect(listAfterRemove.body.users).toHaveLength(0);
    });
  });
});

