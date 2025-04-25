const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const certDir = path.join(__dirname, 'certificates');
const outputDir = path.join(__dirname, 'certificates-encrypted');
const passphrase = process.env.CERT_SECRET;

if (!passphrase) {
  console.error("❌ CERT_SECRET not provided.");
  process.exit(1);
}

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.readdirSync(certDir).forEach(file => {
  const filePath = path.join(certDir, file);
  const outputFile = path.join(outputDir, file + '.enc');
  const data = fs.readFileSync(filePath);
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(passphrase, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([iv, cipher.update(data), cipher.final()]);
  fs.writeFileSync(outputFile, encrypted);
  console.log(`🔒 Encrypted: ${file}`);
});