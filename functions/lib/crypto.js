'use strict';

const crypto = require('crypto');
const ENCRYPTION_KEY = 'v7lfm2i2ld0o4aifxle4q6w1us2dow2x';
const IV = 'zxcvbnmdfrassfgh';

function encrypt(text) {
 let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), IV);
 let encrypted = cipher.update(text);

 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return encrypted.toString('base64');
}

function decrypt(text) {
	var crypt = new Buffer(text, 'base64');
	var decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
	decipher.setAutoPadding(false);
	var dec = decipher.update(crypt);
	dec += decipher.final('utf-8'); 
  return dec.toString();
}


module.exports = { decrypt, encrypt };