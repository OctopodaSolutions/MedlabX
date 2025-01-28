// const { defineConfig } = require('cypress');
// const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
// const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
// const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'http://localhost:3000',
//     async setupNodeEvents(on, config) {
//       const bundler = createBundler({
//         plugins: [createEsbuildPlugin(config)], // Ensure this line is fixed
//       });

//       on('file:preprocessor', bundler);
//       await addCucumberPreprocessorPlugin(on, config);

//       return config;
//     },
//     specPattern: "cypress/e2e/**/*.feature",
//     supportFile: "cypress/support/e2e.js",
//   },
// });




const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');


module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    async setupNodeEvents(on, config) {
      // Create the bundler for esbuild (if used)
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)], // Ensure this line is fixed
      });

      // Register the bundler
      on('file:preprocessor', bundler);

      // Add the Cucumber preprocessor plugin
      await addCucumberPreprocessorPlugin(on, config);

      

      return config;
    },
    specPattern: "cypress/e2e/**/*.feature", // Cucumber feature file pattern
    supportFile: "cypress/support/e2e.js",   // Support file for Cucumber
  },
});




// const { defineConfig } = require('cypress');
// const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
// const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
// const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'http://localhost:3000',
//     async setupNodeEvents(on, config) {
//       // Create the bundler for esbuild (if used)
//       const bundler = createBundler({
//         plugins: [createEsbuildPlugin(config)], // Ensure this line is fixed
//       });

//       // Register the bundler
//       on('file:preprocessor', bundler);

//       // Add the Cucumber preprocessor plugin
//       await addCucumberPreprocessorPlugin(on, config);

//       // Returning the config object after setting up everything
//       return config;
//     },
//     reporter: 'mochawesome',  // Set mochawesome as the reporter
//     reporterOptions: {
//       reportDir: 'cypress/reports/mochawesome', // Directory where reports will be saved
//       overwrite: false, // Set to true to overwrite previous reports
//       html: true, // Generate HTML report
//       json: true, // Generate JSON report
//       quiet: true, // Silence the Mochawesome reporter
//       reportFilename: 'report.html', // Name of the HTML report file
//     },
//     specPattern: 'cypress/e2e/**/*.feature', // Cucumber feature file pattern
//     supportFile: 'cypress/support/e2e.js',   // Support file for Cucumber
//   },
// });
