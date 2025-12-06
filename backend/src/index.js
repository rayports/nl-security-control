const app = require('./app');
const config = require('./config/config');

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} (${config.env})`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

