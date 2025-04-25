const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function decryptCertFile(encPath, passphrase) {
  const encrypted = fs.readFileSync(encPath);
  const iv = encrypted.slice(0, 16);
  const content = encrypted.slice(16);
  const key = crypto.scryptSync(passphrase, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  return Buffer.concat([decipher.update(content), decipher.final()]);
}

module.exports = { decryptCertFile };
