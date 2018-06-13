import {exec} from '../utils';
import {Serial} from "../provider";

const CMD = "wmic csproduct get IdentifyingNumber";

export =  async function (): Promise<Serial> {
  let result: string = await exec(CMD);

  if (!result) new Error('Can not retrieve serial number for ' + process.platform + '@' + process.arch);

  result = result.toString().trim();

  return {
    type: 'WIN',
    raw: result.slice(result.lastIndexOf('\r\n') + 2).trim()
  };
};
