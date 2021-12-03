/// <reference types="Cypress" />

context("Log as new User", () => {
    
    it("Login for the new user", () => {
        cy.visit("localhost:3000");
        cy.clearLocalStorage();
        cy.getById("login-col").click()
        cy.url().should('eq', "http://localhost:3000/loginpage")
        cy.getByTestId("username").type("stestrippoli@gmail.com").should("have.value", "stestrippoli@gmail.com")
        cy.getByTestId("password").type("stestrippoli").should("have.value", "stestrippoli")
        cy.getByTestId("login-button").click()
        cy.location('pathname', {timeout: 10000 }).should('eq', '/shopemployee');


        
    })
})