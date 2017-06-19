"use strict";

const {execSync} = require('child_process');

const CMD = "system_profiler SPHardwareDataType | sed -n 's/.*Serial Number (system).*: /OSX/p'";

module.exports = function (prefix) {
  prefix = prefix || '';

  const result = execSync(prefix + CMD);
  if (!result) {
    throw new Error('Can not retrieve serial number for ' + process.platform + '@' + process.arch);
  }

  return {
    type: 'osx',
    raw: result.toString().trim()
  }
};
