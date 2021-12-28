/// <reference types="Cypress" />

context("Log as new User", () => {
    
    it("Login for the new user", () => {
        cy.visit("localhost:3000");
        cy.clearLocalStorage();
        cy.getById("login-col").click()
        cy.url().should('eq', "http://localhost:3000/loginpage")
        cy.getByTestId("username").type("shopemployee@gmail.com").should("have.value", "shopemployee@gmail.com")
        cy.getByTestId("password").type("shopemployee").should("have.value", "shopemployee")
        cy.getByTestId("login-button").click()
        cy.location('pathname', {timeout: 10000 }).should('eq', '/shopemployee');
        
    })
})