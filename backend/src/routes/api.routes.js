const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const systemService = require('../services/system.service');

router.post('/arm-system', async (req, res, next) => {
  try {
    const { mode } = req.body;
    const state = systemService.armSystem(mode || 'away');
    res.json({ success: true, state });
  } catch (error) {
    next(error);
  }
});

router.post('/disarm-system', async (req, res, next) => {
  try {
    const state = systemService.disarmSystem();
    res.json({ success: true, state });
  } catch (error) {
    next(error);
  }
});

router.post('/add-user', async (req, res, next) => {
  try {
    const { name, pin, start_time, end_time, permissions } = req.body;
    
    if (!name || !pin) {
      const error = new Error('Name and PIN are required');
      error.status = 400;
      return next(error);
    }

    const user = userService.addUser({
      name,
      pin,
      start_time: start_time ? new Date(start_time) : null,
      end_time: end_time ? new Date(end_time) : null,
      permissions: permissions || []
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

router.post('/remove-user', async (req, res, next) => {
  try {
    const { identifier } = req.body;
    
    if (!identifier) {
      const error = new Error('Identifier (name or PIN) is required');
      error.status = 400;
      return next(error);
    }

    const user = userService.removeUser(identifier);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

router.get('/list-users', async (req, res, next) => {
  try {
    const users = userService.getUsers();
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

