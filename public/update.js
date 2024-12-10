const { autoUpdater } = require('electron-updater');
const axios = require('axios');
const { logger } = require('./logger');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const https = require('https');
const { exec } = require('child_process');

function checkIfUpdateAvailable() {
    return new Promise((resolve, reject) => {
        autoUpdater.setFeedURL({
            provider: 'github',
            owner: 'OctopodaSolutions',
            repo: 'GSpec',
            token: process.env.GH_TOKEN,
            updaterCacheDirName: 'XCSM'
        });


        const handleUpdateAvailable = (info) => {
            logger.info("Update Available", info);

            const releaseUrl = `https://api.github.com/repos/OctopodaSolutions/GSpec/releases/latest`;
            axios.get(releaseUrl, { headers: { Authorization: `token ${process.env.GH_TOKEN}` } })
                .then((response) => {
                    logger.info("Release info fetched successfully");
                    const updateInfo = {
                        releaseData: response.data,
                        updateStream: 'Update Available'
                    };
                    resolve(updateInfo);
                })
                .catch((err) => {
                    logger.error(`Error fetching release info: ${err.message}`);
                    reject(err);
                });
        };

        const handleUpdateNotAvailable = () => {
            logger.info("No update available");
            resolve({ updateAvailable: false });
        };

        autoUpdater.once('update-available', handleUpdateAvailable);
        autoUpdater.once('update-not-available', handleUpdateNotAvailable);

        autoUpdater.once('error', (err) => {
           
            logger.error(`Update check error: ${err.message}`);
            reject(err);
        });

      
        autoUpdater.checkForUpdates();
    });
}





function checkIfUpdateDownloaded() {
    return new Promise((resolve, reject) => {
      
        autoUpdater.setFeedURL({
            provider: 'github',
            owner: 'OctopodaSolutions',
            repo: 'GSpec',
            token: process.env.GH_TOKEN,
            updaterCacheDirName: 'XCSM'
        });

        const cacheDir = path.join(process.env.LOCALAPPDATA, 'XCSM', 'pending');
        const updateFile = path.join(cacheDir, 'update.exe');


        fs.access(updateFile, fs.constants.F_OK, (err) => {
            if (err) {
                logger.info("Update not downloaded");
                resolve({ updateDownloaded: false });
            } else {
                logger.info("Update downloaded");

                const releaseUrl = `https://api.github.com/repos/OctopodaSolutions/GSpec/releases/latest`;
                axios.get(releaseUrl, { headers: { Authorization: `token ${process.env.GH_TOKEN}` } })
                    .then((response) => {
                        const latestVersion = response.data.tag_name.replace(/^v/, '');
                        const currentVersion = autoUpdater.currentVersion.version;

                        if (latestVersion === currentVersion) {
                            logger.info("Downloaded update is the same as the current version");
                            resolve({ updateDownloaded: false });
                        } else {
                            logger.info("Downloaded update is different from the current version");
                            resolve({ updateDownloaded: true });
                        }
                    })
                    .catch((err) => {
                        logger.error(`Error fetching latest release version: ${err.message}`);
                        reject(err);
                    });
            }
        });
    });
}

const userDataPath = app.getPath('userData');
const backupDir = path.join(userDataPath, 'backup');

const configFile = path.join('C:', 'Program Files', 'XCSM', 'resources', 'resources', 'config.json');
const cssConfigFile = path.join('C:', 'Program Files', 'XCSM', 'resources', 'resources', 'CssConfig.json');
const envFile = path.join('C:', 'Program Files', 'XCSM', 'resources', 'resources', '.env');

function runPowerShellCommand(src, dest, scriptPath) {
    return new Promise((resolve, reject) => {
        const command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -SourceFile "${src}" -DestinationFile "${dest}"`;

        exec(command, { windowsHide: true }, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error executing PowerShell command for ${src}: ${stderr || err.message}`);
                reject(err);
            } else {
                console.log(`Successfully executed PowerShell command for ${src}`);
                resolve();
            }
        });
    });
}

function restoreFiles() {
    const filesToRestore = [
        { src: path.join(backupDir, 'config.json'), dest: configFile },
        { src: path.join(backupDir, 'CssConfig.json'), dest: cssConfigFile },
        { src: path.join(backupDir, '.env'), dest: envFile }
    ];

  
    const scriptPath = app.isPackaged 
        ? path.join(process.resourcesPath, 'resources', 'restore-files.ps1') 
        : path.join(app.getAppPath(), 'public', 'restore-files.ps1');

   
    console.log(`Script Path: ${scriptPath}`);

    
    const restorationPromises = filesToRestore.map(file => {
        if (fs.existsSync(file.src)) {
            console.log(`Restoring from ${file.src} to ${file.dest}`);
            return runPowerShellCommand(file.src, file.dest, scriptPath);
        } else {
            console.log(`Backup file not found for restoration: ${file.src}`);
            return Promise.resolve(); 
        }
    });

    
    return Promise.all(restorationPromises);
}



function quitandInstallFromLocal() {
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
        console.log(`Created backup directory: ${backupDir}`);
    } else {
        console.log(`Backup directory already exists: ${backupDir}`);
    }


    function backupFiles() {
        const filesToBackup = [
            { src: configFile, dest: path.join(backupDir, 'config.json') },
            { src: cssConfigFile, dest: path.join(backupDir, 'CssConfig.json') },
            { src: envFile, dest: path.join(backupDir, '.env') }
        ];
    
        filesToBackup.forEach(file => {
            if (fs.existsSync(file.src)) {
                try {
                    fs.copyFileSync(file.src, file.dest);
                    console.log(`Backed up ${file.src} to ${file.dest}`);
                } catch (err) {
                    console.error(`Error backing up ${file.src}: ${err.message}`);
                }
            } else {
                console.log(`File not found for backup: ${file.src}`);
            }
        });
    }

    return new Promise((resolve, reject) => {
        const cacheDir = path.join(process.env.LOCALAPPDATA, 'XCSM', 'pending');
        const updateFile = path.join(cacheDir, 'update.exe');

        console.log(`Cache directory: ${cacheDir}`);
        console.log(`Update file path: ${updateFile}`);

        fs.access(updateFile, fs.constants.F_OK, (err) => {
            if (err) {
                console.error("Update file not found for installation");
                reject(new Error("Update file not found for installation"));
            } else {
                console.log("Update file found. Preparing to quit and install.");

                try {
                    backupFiles();
                    autoUpdater.quitAndInstall(true, false);
                    resolve({ success: true, message: "Application will quit and install the update." });
                } catch (error) {
                    console.error(`Error during quit and install: ${error.message}`);
                    reject(new Error(`Error during quit and install: ${error.message}`));
                }
            }
        });
    });
}


module.exports = { quitandInstallFromLocal, checkIfUpdateDownloaded, checkIfUpdateAvailable, restoreFiles };