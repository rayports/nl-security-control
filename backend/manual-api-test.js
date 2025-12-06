// Manual API test script - run with: node manual-api-test.js
const request = require('supertest');
const app = require('./src/app');

const logSection = (title) => {
  console.log('\n' + '='.repeat(60));
  console.log(title);
  console.log('='.repeat(60));
};

const logRequest = (method, url, body = null) => {
  console.log(`\nRequest: ${method} ${url}`);
  if (body) {
    console.log('Body:', JSON.stringify(body, null, 2));
  }
};

const logResponse = (response) => {
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.body, null, 2));
};

(async () => {
  try {
    // Test 1: Health Check
    logSection('Test 1: GET /healthz');
    logRequest('GET', '/healthz');
    const healthResponse = await request(app).get('/healthz');
    logResponse(healthResponse);

    // Test 2: Arm System
    logSection('Test 2: POST /api/arm-system');
    const armBody = { mode: 'home' };
    logRequest('POST', '/api/arm-system', armBody);
    const armResponse = await request(app)
      .post('/api/arm-system')
      .send(armBody);
    logResponse(armResponse);

    // Test 3: Disarm System
    logSection('Test 3: POST /api/disarm-system');
    logRequest('POST', '/api/disarm-system');
    const disarmResponse = await request(app)
      .post('/api/disarm-system')
      .send({});
    logResponse(disarmResponse);

    // Test 4: Add User
    logSection('Test 4: POST /api/add-user');
    const addUserBody = {
      name: 'John',
      pin: '1234',
      permissions: ['admin']
    };
    logRequest('POST', '/api/add-user', addUserBody);
    const addUserResponse = await request(app)
      .post('/api/add-user')
      .send(addUserBody);
    logResponse(addUserResponse);

    // Test 5: List Users
    logSection('Test 5: GET /api/list-users');
    logRequest('GET', '/api/list-users');
    const listUsersResponse = await request(app).get('/api/list-users');
    logResponse(listUsersResponse);

    // Test 6: Remove User
    logSection('Test 6: POST /api/remove-user');
    const removeUserBody = { identifier: 'John' };
    logRequest('POST', '/api/remove-user', removeUserBody);
    const removeUserResponse = await request(app)
      .post('/api/remove-user')
      .send(removeUserBody);
    logResponse(removeUserResponse);

    // Test 7: NLP - Arm System
    logSection('Test 7: POST /nl/execute - "arm the system in home mode"');
    const nlArmBody = { text: 'arm the system in home mode' };
    logRequest('POST', '/nl/execute', nlArmBody);
    const nlArmResponse = await request(app)
      .post('/nl/execute')
      .send(nlArmBody);
    logResponse(nlArmResponse);

    // Test 8: NLP - Add User
    logSection('Test 8: POST /nl/execute - "add user Alice with pin 5678"');
    const nlAddUserBody = { text: 'add user Alice with pin 5678' };
    logRequest('POST', '/nl/execute', nlAddUserBody);
    const nlAddUserResponse = await request(app)
      .post('/nl/execute')
      .send(nlAddUserBody);
    logResponse(nlAddUserResponse);

    // Test 9: NLP - List Users
    logSection('Test 9: POST /nl/execute - "show me all users"');
    const nlListBody = { text: 'show me all users' };
    logRequest('POST', '/nl/execute', nlListBody);
    const nlListResponse = await request(app)
      .post('/nl/execute')
      .send(nlListBody);
    logResponse(nlListResponse);

    // Test 10: Error Case - Missing required field
    logSection('Test 10: POST /api/add-user - Missing PIN (Error Test)');
    const errorBody = { name: 'Bob' };
    logRequest('POST', '/api/add-user', errorBody);
    const errorResponse = await request(app)
      .post('/api/add-user')
      .send(errorBody);
    logResponse(errorResponse);

    console.log('\n' + '='.repeat(60));
    console.log('All tests completed!');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();

