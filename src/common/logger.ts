import { createLogger, transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
const colors = require('colors/safe');
const Os = require('os');
const logLevel = 0; // process.env.APP_LOG_LEVEL || 'debug';
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6

const consoleLogger = new transports.Console({
  level: 'debug',
  handleExceptions: true,
});

const parseError = (errorData) => {
  if (errorData.message || (errorData.message && errorData.stack)) {
    return JSON.stringify({
      error: errorData.message,
      stack: errorData.stack || '',
    });
  }
  return JSON.stringify(errorData);
};
const normalizeModuleName = (name: string) => {
  if (name === 'undefined' || name === undefined || name === 'null') {
    return normalizeModuleName('unknown');
  }
  const name_length = name.length;
  const require_length = 20;
  let result = name;
  if (name_length == require_length) {
    result = name;
  }
  if (name_length > require_length) {
    result = name.substring(
      0,
      name.length - (name_length - require_length) - 1,
    );
  }
  if (require_length > name_length) {
    result = name.padEnd(require_length - name_length + name.length - 1, '.');
  }
  return result;
};
const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
    format.printf((info) => {
      switch (info.level) {
        case 'info':
          return `${colors.cyan(colors.bold(info.level))}      | ${colors.cyan(
            normalizeModuleName(info.module),
          )} | ${info.timestamp} | ${JSON.stringify(info.message)}`;
        case 'debug':
          return `${colors.magenta(
            colors.bold(info.level),
          )}     | ${colors.magenta(normalizeModuleName(info.module))} | ${
            info.timestamp
          } | ${JSON.stringify(info.message)}`;
        case 'error':
          return `${colors.bgRed(colors.black(info.level))}     | ${colors.red(
            normalizeModuleName(info.module),
          )} | ${info.timestamp} | ${parseError(info.message)}`;
        case 'warn':
          return `${colors.bgYellow(
            colors.black(info.level),
          )}      | ${colors.yellow(normalizeModuleName(info.module))} | ${
            info.timestamp
          } | ${JSON.stringify(info.message)}`;
        default:
          return `${colors.bgBlue(info.level)}     | ${colors.blue(
            normalizeModuleName(info.module),
          )} | ${info.timestamp} | ${JSON.stringify(info.message)}`;
      }
    }),
  ),
  transports: [
    consoleLogger,
    new DailyRotateFile({
      level: 'info',
      filename: Os.homedir() + '/var/logs/notes-api/notes-info.log',
      json: false,
      datePattern: 'yyyy-MM-DD',
      maxFiles: 10,
    }),
    new DailyRotateFile({
      level: 'error',
      filename: Os.homedir() + '/var/logs/notes-api/notes-error.log',
      json: false,
      datePattern: 'yyyy-MM-DD',
      maxFiles: 10,
    }),
  ],
});

export const Logger = (module = null) => {
  return {
    debug(...args: any[]) {
      args.forEach((x) => {
        logger.debug(x, { module });
      });
    },
    info(...args: any[]) {
      args.forEach((x) => {
        logger.info(x, { module });
      });
    },
    error(...args: any[]) {
      args.forEach((x) => {
        logger.error(x, { module });
      });
    },
    warn(...args: any[]) {
      args.forEach((x) => {
        logger.warn(x, { module });
      });
    },
    formats: {
      success(message) {
        return `${message}`;
      },
    },
  };
};
