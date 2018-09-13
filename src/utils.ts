import * as child_process from "child_process";

export function fromCallback<T>(fn: (cb) => void): Promise<T> {
  return new Promise(function (resolve, reject) {
    fn(function (err, data) {
      if (err)
        return reject(err);
      resolve(data);
    });
  })
}

export function exec(command): Promise<string> {
  return new Promise((resolve, reject) => {
    _execute(resolve, reject, command)
  });
}

export function execFile(file, options): Promise<string> {
  return new Promise((resolve, reject) => {
    _executeFile(resolve, reject, file, options)
  });
}

function _execute(resolve, reject, command) {
  child_process.exec(command, (error: Error | null, stdout: string, stderr: string) => {
    if (error) {
      return reject(stderr);
    }

    resolve(stdout);
  });
}

function _executeFile(resolve, reject, file, options) {
  child_process.execFile(file, options, (error: Error | null, stdout: string, stderr: string) => {
    if (error) {
      return reject(stderr);
    }

    resolve(stdout);
  });
}
