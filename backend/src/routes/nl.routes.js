const express = require('express');
const router = express.Router();
const { parseCommand } = require('../services/nlp.service');
const userService = require('../services/user.service');
const systemService = require('../services/system.service');

router.post('/execute', async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      const error = new Error('Text input is required');
      error.status = 400;
      return next(error);
    }

    // Parse the command
    const interpretation = parseCommand(text);
    const { intent, entities } = interpretation;

    let apiCall = {};
    let response = {};

    // Route to appropriate service based on intent
    switch (intent) {
      case 'ARM_SYSTEM':
        apiCall = {
          endpoint: '/api/arm-system',
          method: 'POST',
          payload: { mode: entities.mode || 'away' }
        };
        response = {
          success: true,
          state: systemService.armSystem(entities.mode || 'away')
        };
        break;

      case 'DISARM_SYSTEM':
        apiCall = {
          endpoint: '/api/disarm-system',
          method: 'POST',
          payload: {}
        };
        response = {
          success: true,
          state: systemService.disarmSystem()
        };
        break;

      case 'ADD_USER':
        if (!entities.name || !entities.pin) {
          const error = new Error('Name and PIN are required to add a user');
          error.status = 400;
          return next(error);
        }
        apiCall = {
          endpoint: '/api/add-user',
          method: 'POST',
          payload: {
            name: entities.name,
            pin: entities.pin,
            start_time: entities.start_time,
            end_time: entities.end_time,
            permissions: entities.permissions || []
          }
        };
        response = {
          success: true,
          user: userService.addUser({
            name: entities.name,
            pin: entities.pin,
            start_time: entities.start_time || null,
            end_time: entities.end_time || null,
            permissions: entities.permissions || []
          })
        };
        break;

      case 'REMOVE_USER':
        if (!entities.name && !entities.pin) {
          const error = new Error('Name or PIN is required to remove a user');
          error.status = 400;
          return next(error);
        }
        apiCall = {
          endpoint: '/api/remove-user',
          method: 'POST',
          payload: {
            identifier: entities.name || entities.pin
          }
        };
        response = {
          success: true,
          user: userService.removeUser(entities.name || entities.pin)
        };
        break;

      case 'LIST_USERS':
        apiCall = {
          endpoint: '/api/list-users',
          method: 'GET',
          payload: {}
        };
        response = {
          success: true,
          users: userService.getUsers()
        };
        break;

      default:
        const error = new Error(`Unsupported intent: ${intent}`);
        error.status = 400;
        return next(error);
    }

    res.json({
      text,
      interpretation: {
        intent,
        entities
      },
      api_call: apiCall,
      response
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

