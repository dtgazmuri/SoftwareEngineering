/// <reference types="Cypress" />

context("Log as manager", () => {
    
    it("Login for the new manager", () => {
        cy.visit("localhost:3000");
        cy.clearLocalStorage();
        cy.getById("login-col").click()
        cy.url().should('eq', "http://localhost:3000/loginpage")
        cy.getByTestId("username").type("manager@gmail.com").should("have.value", "manager@gmail.com")
        cy.getByTestId("password").type("manager").should("have.value", "manager")
        cy.getByTestId("login-button").click()
        cy.location('pathname', {timeout: 10000 }).should('eq', '/manager');
        
        
    })
})