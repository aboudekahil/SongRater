const log4js = require('log4js');

log4js.configure({
  appenders: {
    err: { type: 'file', filename: './Logs/Errors.log' },
    out: { type: 'stdout' },
    inf: { type: 'file', filename: './Logs/Logs.log' },
  },
  categories: {
    default: { appenders: ['out', 'err'], level: 'error' },
    default: { appenders: ['out', 'inf'], level: 'info' },
  },
});

const logger = log4js.getLogger();

module.exports = logger;
