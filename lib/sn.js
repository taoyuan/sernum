const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function md5(input) {
  const shasum = crypto.createHash('md5');
  shasum.update(input);
  return shasum.digest('hex');
}

function fromCache() {
  const s = fs.readFileSync(path.join(__dirname, '..', 'cache'));
  return s && s.toString().trim();
}

function normalize(result) {
  let s = md5(result.raw).substr(0, 12);
  if (result.type) {
    s = result.type + s;
  }
  return s.toUpperCase();
}

async function sn(options) {
  if (typeof options === 'boolean') {
    options = {sudo: true};
  }
  options = options || {};
  const {sudo, ignoreCache} = options;
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

  const result = await fn(prefix);
  if (result) {
    return normalize(result);
  }
  if (!ignoreCache) {
    return fromCache();
  }
}

sn.sudo = async (options) => await sn(Object.assign({}, options, {sudo: true}));

module.exports = exports = sn;
