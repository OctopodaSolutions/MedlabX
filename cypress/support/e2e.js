//   // Import commands.js using ES2015 syntax:
//   import './commands'
 
//   Cypress.on('uncaught:exception', (err, runnable) => {
//       // returning false here prevents Cypress from
//       // failing the test
//       return false
//   })

// import { Before } from '@badeball/cypress-cucumber-preprocessor';

// Before(() => {
//   // Login logic
//   cy.visit('/login');
//   cy.get('input[name="username"]').type('engineer@noki.com'); // Replace with actual username
//   cy.get('input[name="password"]').type('engineer'); // Replace with actual password
//   cy.get('button[type="submit"]').click();
//   cy.url().should('include', '/dashboard'); // Verify successful login
// });
