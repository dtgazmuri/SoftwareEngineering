/// <reference types="Cypress" />

context("New User", () => {
     it("Create a new user", () => {
         cy.visit("localhost:3000");
         cy.intercept("GET", "/api/sessions/current", "401")
         cy.clearLocalStorage();
         cy.getById("signin-col").click()
         cy.url().should('eq', "http://localhost:3000/sign-up")
         cy.getByTestId("name").type("Stefano").should("have.value", "Stefano")
         cy.getByTestId("surname").type("Strippoli").should("have.value", "Strippoli")
         cy.getByTestId("username").type("stestrippoli@gmail.com").should("have.value", "stestrippoli@gmail.com")
         cy.getByTestId("password1").type("stestrippoli").should("have.value", "stestrippoli")
         cy.getByTestId("password2").type("stestrippoli").should("have.value", "stestrippoli")
         cy.getByTestId("shopemployee-button").click()
         cy.getByTestId("save-button").click()
         cy.intercept("POST", "/api/users/registration", {
            statusCode: 201,
           /* body : {
                name: "Stefano",
                surname: "Strippoli",
                username: "stestrippoli@gmail.com",
                password: "stestrippoli",
                role: "shopemployee",
            }*/

         }, )  
     })
 })