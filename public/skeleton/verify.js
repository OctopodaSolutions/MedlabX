const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { app } = require('electron');
const si = require('systeminformation');
const { name } = require('../../package.json');

function  loadPublicKey() {
  return `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1l0uycG3yuQAdEa1poIo
lwXTsreFvks4nyrOc3kVI4Z75N9DsAJAwhk4g/TK4nLHC+4TYzYyzd1olQqRapWZ
cFWhz7Tv5yTaCG6B/EwfsfgtxHH8Q+xDZwv/SwrDe3Ze/0rm+Aa++R1HM1TWqMWc
OT7QAGOp5BJfwIZOfEP03N/4xyNyZz1TbfX3zxNinhcQP8i9bIQv11vFn+lTQ3gm
pnJhNwiW25DKy3iq4N9iCjtjljk3+0V/5x4h8MeY9EQit06f4UkWxhesr/SThPoV
pfZ7EpGN77RURUndSuh1Qq/ZrIs4I4Uw2OtHshufFM/Ay98PwB/HZ/LebWMaaI+u
fQIDAQAB
-----END PUBLIC KEY-----`
}

function getLicensePath() {
  if (app.isPackaged) {
    return path.join(app.getPath('userData'), 'license');
  } else {
    return path.join(app.getAppPath(), '/license');
  }
}

function loadCertificate(filename) {
  try {
    const filePath = path.join(getLicensePath(), filename);
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    console.error(`Error reading ${filePath}:`);
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
      const publicKey = loadPublicKey();
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
      reject(false);
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

  if ((hardwareId === licenseData['Device Id']) && (name === licenseData['Product Name'])) {
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