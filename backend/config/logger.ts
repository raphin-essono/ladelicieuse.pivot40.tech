type Level = 'info' | 'warn' | 'error' | 'debug';

function log(level: Level, message: string, meta?: Record<string, unknown>): void {
  const entry = { ts: new Date().toISOString(), level, message, ...(meta && Object.keys(meta).length ? { meta } : {}) };
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
  if (process.env.NODE_ENV === 'production') {
    fn(JSON.stringify(entry));
  } else {
    fn(`[${level.toUpperCase()}] ${message}`, meta ?? '');
  }
}

export const logger = {
  info:  (msg: string, meta?: Record<string, unknown>) => log('info',  msg, meta),
  warn:  (msg: string, meta?: Record<string, unknown>) => log('warn',  msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => log('debug', msg, meta),
};
