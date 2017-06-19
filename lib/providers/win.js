"use strict";

const {execSync} = require('child_process');

const CMD = "wmic csproduct get IdentifyingNumber";

module.exports = function () {
  let result = execSync(CMD);

  if (!result) new Error('Can not retrieve serial number for ' + process.platform + '@' + process.arch);

  result = result.toString().trim();

  return {
    type: 'win',
    raw: result.slice(result.lastIndexOf('\r\n') + 2).trim()
  };
};
