import * as crypto from 'crypto';

export const hash = function(str: string = ''): string {
  if (!str) {
    return str;
  }

  str = str + Math.floor(Math.random() * 1000000);
  return crypto.createHash('md5').update(str).digest('hex');
}

const extra = function(p: string) {
  if (!p || typeof p !== 'string' || !p.includes('/')) {
    return p;
  }

  const arr = p.split('/');
  return arr[arr.length - 1];
}

export const file = { name: { extra } };