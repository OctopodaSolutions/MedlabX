const { dialog } = require('electron');
const {logger} = require('./logger');
const { setDemoMode, closeAppCompletely, restartApp } = require('./actions');

/**
 * Function to show error dialog
 * @param {String} msg 
 * @param {boolean} flag 
 */

// Function to show error dialog
function showErrorDialog(msg, flag=1) {
    // dialog.showErrorBox('Error', String(msg));
    if(flag==1){
      const options = {
        type: 'none',
        buttons: ['Retry', 'Close'],
        defaultId: 0,
        title: 'Error',
        message: String(msg),
      };
    
      dialog.showMessageBox(null, options).then(result => {
        if (result.response === 0) {
          // Logic for retry action
          logger.debug('User clicked Retry');
          restartApp();
          // app.relaunch();
          // app.exit(0);
        } else {
          // Logic for close action
          logger.debug('User clicked Close');
          closeAppCompletely();
          // app.quit();
        }
      });
  
    }
    else if (flag==2){

      const options = {
        type: 'info', // This can be "none", "info", "error", "question", or "warning"
        buttons: ['Demo', 'Relaunch', 'Close'],
        defaultId: 0,
        title: 'Choose an Option',
        message: `${msg}. Please select an action to proceed.`,
        detail: 'Click Demo to run in demo mode, Relaunch to restart the application, or Close to exit.',
        noLink: true,
      };
    
      dialog.showMessageBox(null, options).then(result => {
        switch(result.response) {
          case 0:
            logger.info("User selected Demo");
            setDemoMode(true);
            // app.relaunch();
            // app.exit(0);
            restartApp();
            break;
          case 1:
            logger.info("User selected Relaunch");
            // app.relaunch();
            // app.exit(0);
            restartApp();
            break;
          case 2:
            logger.info("User selected Close");
            // app.quit();
            closeAppCompletely();
            break;
          default:
            logger.info("No valid option selected");
        }
      }).catch(err => {
        logger.error("An error occurred while displaying the dialog:", err);
      });

      
    }
    else if (flag===3){
      const options = {
        type: 'none',
        buttons: [ 'Close'],
        defaultId: 0,
        title: 'Error',
        message: String(msg),
      };
    
      dialog.showMessageBox(null, options).then(result => {
        if(result.response===0){
          logger.debug("User Clicked Close");
          // app.relaunch();
          // app.exit(0);

        }else {
          // Logic for close action
          logger.debug('User clicked Close');
          // app.quit();
        }
      });
  
    }

  }

  module.exports ={
    showErrorDialog
  }