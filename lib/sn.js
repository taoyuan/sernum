/**
 * Created by taoyuan on 2017/6/18.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function md5(input) {
	const shasum = crypto.createHash('md5');
	shasum.update(input);
	return shasum.digest('hex');
}

function sn(sudo) {
	const prefix = sudo ? 'sudo ' : '';

	function fromCache() {
		const s = fs.readFileSync(path.join(__dirname, '..', 'cache'));
		return s && s.toString().trim();
	}

	function parseResult(result) {
		let s = md5(result.raw).substr(0, 12);
		if (result.type) {
			s = result.type + s;
		}
		return s.toUpperCase();
	}

	let fn = null;
	switch (process.platform) {
		case 'win32':
			fn = require('./providers/win');
			break;
		case 'darwin':
			fn = require('./providers/darwin');
			break;
		case 'linux':
		case 'freebsd':
			fn = require('./providers/linux');
			break;
	}
	if (!fn) throw new Error('Cannot provide serial number for ' + process.platform);

	const result = fn(prefix);
	return result ? parseResult(result) : fromCache();
}

sn.sudo = () => sn(true);

module.exports = exports = sn;
