/// <reference types="Cypress" />

context("Shop Employee", () => {
     it("Create a new customer", () => {
        cy.visit("localhost:3000");
        cy.clearLocalStorage();
        cy.getById("login-col").click()
        cy.url().should('eq', "http://localhost:3000/loginpage")
        cy.getByTestId("username").type("stestrippoli@gmail.com").should("have.value", "stestrippoli@gmail.com")
        cy.getByTestId("password").type("stestrippoli").should("have.value", "stestrippoli")
        cy.getByTestId("login-button").click()
        cy.url().should('eq', "http://localhost:3000/shopemployee")
        cy.intercept("GET", {
            url: "/api/sessions/current", 
            statusCode: 200,
            timeout:3000})
        cy.clearLocalStorage();
        cy.getByTestId("create-button").click()
        cy.getByTestId("name").type("CustomerTest").should("have.value", "CustomerTest")
        cy.getByTestId("surname").type("Customer").should("have.value", "Customer")
        cy.getByTestId("username").type("customertest@gmail.com").should("have.value", "customertest@gmail.com")
        cy.getByTestId("password").type("customertest").should("have.value", "customertest")
        cy.getByTestId("save-button").click()
        cy.intercept("POST", {
            url : "/api/customer",
            statusCode: 200,
            timeout: 5000 },
            )  
     })
 })