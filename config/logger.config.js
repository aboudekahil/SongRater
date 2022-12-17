const log4js = require('log4js');

log4js.configure({
  appenders: { http500: { type: 'file', filename: './Logs/Errors.log' } },
  categories: { default: { appenders: ['http500'], level: 'error' } },
});

const logger = log4js.getLogger('http500');

module.exports = logger;
