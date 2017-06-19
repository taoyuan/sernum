const {exec} = require('../utils');

const CMD = "wmic csproduct get IdentifyingNumber";

module.exports = async function () {
  let result = await exec(CMD);

  if (!result) new Error('Can not retrieve serial number for ' + process.platform + '@' + process.arch);

  result = result.toString().trim();

  return {
    type: 'WIN',
    raw: result.slice(result.lastIndexOf('\r\n') + 2).trim()
  };
};
