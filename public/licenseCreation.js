const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const si = require('systeminformation');
const { name } = require('../package.json');

async function initializeLicenseFile() {
  const licenseDir = path.join(app.getPath('userData'), 'license');
  const licenseFilePath = path.join(licenseDir, 'license.txt');

  // Check if license file already exists
  if (!fs.existsSync(licenseFilePath)) {
    try {
      // Create the folder if it doesn't exist
      if (!fs.existsSync(licenseDir)) {
        fs.mkdirSync(licenseDir, { recursive: true });
      }
      const disk = await si.diskLayout();
      const diskSerial = disk[0].serialNum;
      const now = new Date();
      now.setDate(now.getDate() - 1);
      const expiryDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      // License content
      const licenseData = {
        "Product Name": name,
        "Product Key": "0001",
        "Device Id": diskSerial,
        "Expiry Date": expiryDate,
      };

      // Write the file
      fs.writeFileSync(licenseFilePath, JSON.stringify(licenseData, null, 2), 'utf8');
      console.log('License file created at:', licenseFilePath);
    } catch (err) {
      console.error('Failed to create license file:', err);
    }
  } else {
    console.log('License file already exists. Skipping creation.');
  }
}

module.exports = { initializeLicenseFile };
