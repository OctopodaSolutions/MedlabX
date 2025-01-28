import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';


Given('I log in with valid credentials', () => {
  cy.visit('/');
  cy.get('input[name="email"]').type('engineer@noki.com');
  cy.get('input[name="password"]').type('engineer');
  cy.get('button[type="submit"]').click(); 
});

Then('I should be redirected to the dashboard', () => {
  cy.url().should('include', '/dashboard'); 
});


// Then('I click on card to redirect to the MCA page',()=>{
//   cy.get('[data-testid="card"]').click();
//   cy.url().should('include','/nav')
// })


Then('I click on avatar to open the menu and logout',()=>{
  cy.wait(6000); 
  cy.get('[data-testid="avatar"]').click()
  cy.get('[id="menu-appbar"]').should('be.visible');
  cy.get('[id="logout"]').click()
  cy.get('[data-testid="logout-button"]').click();

})