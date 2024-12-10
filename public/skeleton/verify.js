const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { app } = require('electron');
const si = require('systeminformation');

function getCertificatesPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'resources/certificates');
  } else {
    return path.join(app.getAppPath(), '/certificates');
  }
}

function loadCertificate(filename) {
  try {
    const filePath = path.join(getCertificatesPath(), filename);
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    console.error(`Error reading ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * This function will verify the user license
 * @returns bool
 */
function verifyLicense() {
  return new Promise((resolve, reject) => {
    // console.log("start",getCertificatesPath());
    try {
      const publicKey = loadCertificate('public_key.pem');
      const licenseData = loadCertificate('license.txt').trim();
      const licenseSigBase64 = loadCertificate('license.sig.b64').trim();
      const licenseSig = Buffer.from(licenseSigBase64, 'base64');

      const isVerified = crypto.verify(
        'sha256',
        Buffer.from(licenseData, 'utf-8'),
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING, // Simpler padding scheme
        },
        licenseSig
      );

      if (isVerified) {
        console.log('License is valid');
        resolve(true)
      } else {
        console.log('License is invalid');
        resolve(false)
      }
      resolve(false);
    } catch { 
      console.error('Error during license verification:', error.message);
      reject(error); 
    }
  });

}

/**
 * 
 * @returns String - disk serial number
 */
async function getHardwareId() {
  try {
    const disk = await si.diskLayout();
    const diskSerial = disk[0].serialNum;

    return diskSerial;
  } catch (error) {
    console.error('Error retrieving hardware ID:', error);
    return null;
  }
}

function readLicenseFile() {
  try {
    const licenseData = loadCertificate('license.txt');
    const licenseJson = JSON.parse(licenseData);

    return licenseJson;
  } catch (error) {
    console.error('Error reading license file:', error);
    return null;
  }
}

async function verifyDeviceId() {
  const hardwareId = await getHardwareId();
  if (!hardwareId) {
    console.log('Failed to retrieve hardware ID.');
    return false;
  }

  const licenseData = readLicenseFile();
  if (!licenseData || !licenseData['Device Id']) {
    console.log('Failed to read device ID from license file.');
    return false;
  }

  if (hardwareId === licenseData['Device Id']) {
    console.log('Device ID matches.');
    return true;
  } else {
    console.log('Device ID does not match.');
    return false;
  }
}

function isLicenseValid() {
  const license = readLicenseFile();
  if (!license) return false;

  const currentDate = new Date();
  const expiryDate = new Date(license["Expiry Date"]);

  const timeDiff = expiryDate - currentDate;
  
  // Convert time difference from milliseconds to days
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  if (dayDiff > 0 && dayDiff <= 10) {
    console.log('License will expire soon.');
    return {val: true ,display: true, message:`License will expire on ${license["Expiry Date"]}. Please contact us for renewal`}
  } else if (dayDiff < 0) {
    console.log('License is expired.');
    return {val: false ,display: true, message:'License is expired. Please contact us for renewal'}
  } else if (dayDiff > 10) {
    console.log('License is Valid. Expiry Date ',license["Expiry Date"]);
    return {val: true ,display: false, message:'License is Valid'}
  } else {
    console.log('Today your license will be expired.');
    return {val: true ,display: true, message:'Today your license will be expired, Please contact us for renewal'}
  }
}




// verifyLicense();
module.exports = { verifyLicense, verifyDeviceId, isLicenseValid, readLicenseFile };