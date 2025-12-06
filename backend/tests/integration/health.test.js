const request = require('supertest');
const app = require('../../src/app');

describe('Health Routes', () => {
  describe('GET /healthz', () => {
    test('should return 200 with status ok', async () => {
      const response = await request(app).get('/healthz');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });

    test('should return JSON content type', async () => {
      const response = await request(app).get('/healthz');

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});

