const express = require('express');
const apiRoutes = require('./api.routes');
const nlRoutes = require('./nl.routes');
const healthRoutes = require('./health.routes');

const router = express.Router();

router.use('/api', apiRoutes);
router.use('/nl', nlRoutes);
router.use('/', healthRoutes);

module.exports = router;

