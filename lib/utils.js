const child_process = require('child_process');

function exec(command) {
  return new Promise(function(resolve, reject) {
    doExecute(resolve, reject, command)
  });
}

function execFile(file, options) {
  return new Promise(function(resolve, reject) {
    doExecuteFile(resolve, reject, file, options)
  });
}

function doExecute(resolve, reject, command) {
  child_process.exec(command, function(error, stdout, stderr){
    if (error) {
      return reject(stderr);
    }

    resolve(stdout);
  });
}

function doExecuteFile(resolve, reject, file, options) {
  child_process.execFile(file, options, function(error, stdout, stderr){
    if (error) {
      return reject(stderr);
    }

    resolve(stdout);
  });
}

module.exports = {
  exec,
  execFile
};
