import {Serial} from "../provider";
import {exec, fromCallback} from '../utils';

const CMD_CPU_SERIAL = "cat /proc/cpuinfo | grep Serial | cut -f 2 -d ':'";
const CMD_DMI_SERIAL = "dmidecode -t system | grep Serial | cut -d ':' -f 2";

export = async function (prefix): Promise<Serial> {
  prefix = prefix || '';

  const cmd = process.arch === 'arm' ? CMD_CPU_SERIAL : CMD_DMI_SERIAL;

  let result = await exec(prefix + cmd);
  if (!result) {
    result = result.toString().trim();
  }

  try {
    if (!parseInt(result)) result = '';
  } catch (e) {
  }

  if (!result) {
    result = <string> await fromCallback(cb => require('getmac').getMac(cb));
  }

  if (!result) {
    throw new Error('Can not retrieve serial number for ' + process.platform + '@' + process.arch);
  }

  return {
    raw: result
  };
};
