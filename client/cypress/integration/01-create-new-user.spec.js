/// <reference types="Cypress" />

context("New User", () => {
     it("Create a new user", () => {
         cy.visit("localhost:3000");
         cy.clearLocalStorage();

         cy.getById("signin-col").click()
         cy.url().should('eq', "http://localhost:3000/sign-up")
         cy.getByTestId("name").type("Stefano")
         cy.getByTestId("surname").type("Strippoli")
         cy.getByTestId("username").type("stestrippoli")
         cy.getByTestId("password1").type("stestrippoli")
         cy.getByTestId("password2").type("stestrippoli")
         cy.getByTestId("customer-button").click()
         cy.getByTestId("save-button").click()
         
     })
 })