const { clearAllUserSessions } = require('../../public/skeleton/Redis API/redis'); // Adjust path to your function
const cucumber = require('cypress-cucumber-preprocessor').default;
const report = require('multiple-cucumber-html-reporter'); // Import the report generator

module.exports = {
  e2e: {
    // Hook for preprocessing cucumber feature files
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber()); // Process cucumber feature files

      // Register the 'clearAllUserSessions' task
      on('task', {
        clearAllUserSessions: () => {
          return new Promise((resolve, reject) => {
            try {
              clearAllUserSessions(); // Call the function to clear user sessions
              resolve('User sessions cleared.');
            } catch (err) {
              reject('Error clearing user sessions.');
            }
          });
        },
      });
      // Report generation logic
      console.log('------------------------------test run completed');
      on('after:run', (results) => {
        try {
          console.log('Test run completed. Generating report...');
          if (results && results.totalFailed > 0) {
            console.log('Test run completed with failures.');
          }
      
          // Generate the HTML report after tests are run
          report.generate({
            jsonDir: 'cypress/reports/json',
            reportPath: 'cypress/reports/html',
            metadata: {
              browser: {
                name: 'electron',
                version: '4.6.5',
              },
              device: 'Ubuntu 24.04.1 LTS',
              platform: {
                name: 'Linux',
                version: '24.04.1 LTS',
              },
            },
          });
      
          console.log(`Cucumber report generated at: cypress/reports/html/index.html`);
        } catch (error) {
          console.error('Error during report generation:', error);
        }
      });
    },

    // Path to your feature files and support file
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.js', // Path to your support file
  },
};
