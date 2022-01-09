/// <reference types="Cypress" />

context("Log as new User", () => {
    
    it("Login for the farmer", () => {
        cy.visit("localhost:3000");
        cy.clearLocalStorage();
        cy.getById("login-col").click()
        cy.url().should('eq', "http://localhost:3000/loginpage")
        cy.getByTestId("username").type("calvin@gmail.com").should("have.value", "calvin@gmail.com")
        cy.getByTestId("password").type("farmer").should("have.value", "farmer")
        cy.getByTestId("login-button").click()
        cy.location('pathname', {timeout: 10000 }).should('eq', '/farmer');

    })
})