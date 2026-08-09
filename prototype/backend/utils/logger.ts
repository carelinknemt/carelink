export const logger = {
  info: (msg: string) => console.log(`[CARELINK BACKEND INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg: string, err?: any) => console.error(`[CARELINK BACKEND ERROR] ${new Date().toISOString()} - ${msg}`, err || ''),
};
