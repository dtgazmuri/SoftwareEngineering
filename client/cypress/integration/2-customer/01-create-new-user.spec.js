/// <reference types="Cypress" />

context("New User", () => {
     it("Create a new customer", () => {
         cy.visit("localhost:3000");
         cy.intercept("GET", "/api/sessions/current", "401")
         cy.clearLocalStorage();
         cy.getById("signin-col").click()
         cy.url().should('eq', "http://localhost:3000/sign-up")
         cy.getByTestId("name").type("Customer").should("have.value", "Customer")
         cy.getByTestId("surname").type("Customer").should("have.value", "Customer")
         cy.getByTestId("username").type("newcust@gmail.com").should("have.value", "newcust@gmail.com")
         cy.getByTestId("password1").type("customer").should("have.value", "customer")
         cy.getByTestId("password2").type("customer").should("have.value", "customer")
         cy.getByTestId("customer-button").click()
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