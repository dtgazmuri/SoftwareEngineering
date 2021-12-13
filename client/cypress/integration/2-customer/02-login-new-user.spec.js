/// <reference types="Cypress" />

context("Log as new User", () => {
    
    it("Login for the new customer", () => {
        cy.visit("localhost:3000");
        cy.clearLocalStorage();
        cy.getById("login-col").click()
        cy.url().should('eq', "http://localhost:3000/loginpage")
        cy.getByTestId("username").type("newcust@gmail.com").should("have.value", "newcust@gmail.com")
        cy.getByTestId("password").type("customer").should("have.value", "customer")
        cy.getByTestId("login-button").click()
        cy.location('pathname', {timeout: 10000 }).should('eq', '/customer');


        
    })
})