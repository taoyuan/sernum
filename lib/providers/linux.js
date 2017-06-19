"use strict";

const {execSync} = require('child_process');

const CMD_CPU_SERIAL = "cat /proc/cpuinfo | grep Serial | cut -f 2 -d ':'";
const CMD_DMI_SERIAL = "dmidecode -t system | grep Serial | cut -d ':' -f 2";

module.exports = function (prefix) {
  prefix = prefix || '';

  const cmd = process.arch === 'arm' ? CMD_CPU_SERIAL : CMD_DMI_SERIAL;

  let result = execSync(prefix + cmd);

  if (!result) {
    throw new Error('Can not retrieve serial number for ' + process.platform + '@' + process.arch);
  }

  return {
    raw: result.toString().trim()
  };
};
