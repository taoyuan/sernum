import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import {Serial} from "./provider";

export interface SnOptions {
  sudo?: boolean;
  ignoreCache?: boolean;
  typePrefix?: boolean;
}

export async function sn(options?: SnOptions);
export async function sn(sudo?: boolean);
export async function sn(options?: SnOptions | boolean) {
  if (typeof options === 'boolean') {
    options = {sudo: true};
  }
  options = options || {};
  const {sudo, ignoreCache, typePrefix} = options;
  const prefix = sudo ? 'sudo ' : '';

  const fn = (() => {
    switch (process.platform) {
      case 'win32':
        return require('./providers/win');
      case 'darwin':
        return require('./providers/darwin');
      case 'linux':
      case 'freebsd':
        return require('./providers/linux');
    }
  })();

  if (!fn) throw new Error('Cannot provide serial number for ' + process.platform);

  const serial = await fn(prefix);
  if (serial) {
    return normalize(serial, typePrefix);
  }
  if (!ignoreCache) {
    return fromCache();
  }
}

export namespace sn {
  export async function sudo(options: SnOptions) {
    return await sn({sudo: true, ...options});
  }
}

function md5(input) {
  const shasum = crypto.createHash('md5');
  shasum.update(input);
  return shasum.digest('hex');
}

function fromCache() {
  const s = fs.readFileSync(path.join(__dirname, '..', 'cache'));
  return s && s.toString().trim();
}

function normalize(serial: Serial, prefix?: boolean) {
  let s = md5(serial.raw).substr(0, 12);
  prefix = (prefix == null) || prefix;
  if (serial.type && prefix) {
    s = serial.type + s;
  }
  return s.toUpperCase();
}

