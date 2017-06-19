const {exec} = require('../utils');

const CMD = "system_profiler SPHardwareDataType | sed -n 's/.*Serial Number (system).*: /OSX/p'";

module.exports = async function (prefix) {
  prefix = prefix || '';

  const result = await exec(prefix + CMD);
  if (!result) {
    throw new Error('Can not retrieve serial number for ' + process.platform + '@' + process.arch);
  }

  return {
    type: 'OSX',
    raw: result.toString().trim()
  }
};
