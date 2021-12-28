// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getById', id => {
    cy.get(`[id="${id}"]`);
  });

  Cypress.Commands.add('getByTestId', id => {
    cy.get(`[test-id="${id}"]`);
  });


Cypress.Commands.add('getByControlId', id => {
    cy.get(`[controlId="${id}"]`);
});

Cypress.Commands.add('loginfarmer',()  => {
  cy.visit("localhost:3000");
  cy.clearLocalStorage();
  cy.getById("login-col").click()
  cy.url().should('eq', "http://localhost:3000/loginpage")
  cy.getByTestId("username").type("farmer@gmail.com").should("have.value", "farmer@gmail.com")
  cy.getByTestId("password").type("farmer").should("have.value", "farmer")
  cy.getByTestId("login-button").click()
  cy.location('pathname', {timeout: 10000 }).should('eq', '/farmer');
});
Cypress.Commands.add('loginmanager',()  => {
  
        cy.visit("localhost:3000");
        cy.clearLocalStorage();
        cy.getById("login-col").click()
        cy.url().should('eq', "http://localhost:3000/loginpage")
        cy.getByTestId("username").type("manager@gmail.com").should("have.value", "manager@gmail.com")
        cy.getByTestId("password").type("manager").should("have.value", "manager")
        cy.getByTestId("login-button").click()
        cy.location('pathname', {timeout: 10000 }).should('eq', '/manager');
        
})

Cypress.Commands.add('loginshopemp',()  => {
  cy.visit("localhost:3000");
  cy.clearLocalStorage();
  cy.getById("login-col").click()
  cy.url().should('eq', "http://localhost:3000/loginpage")
  cy.getByTestId("username").type("shopemployee@gmail.com").should("have.value", "shopemployee@gmail.com")
  cy.getByTestId("password").type("shopemployee").should("have.value", "shopemployee")
  cy.getByTestId("login-button").click()
  cy.location('pathname', {timeout: 10000 }).should('eq', '/shopemployee');
});



Cypress.Commands.add('logincustomer',()  => {
  cy.visit("localhost:3000");
  cy.clearLocalStorage();
  cy.getById("login-col").click()
  cy.url().should('eq', "http://localhost:3000/loginpage")
  cy.getByTestId("username").type("customer@gmail.com").should("have.value", "customer@gmail.com")
  cy.getByTestId("password").type("customer").should("have.value", "customer")
  cy.getByTestId("login-button").click()
  cy.location('pathname', {timeout: 10000 }).should('eq', '/customer');
});