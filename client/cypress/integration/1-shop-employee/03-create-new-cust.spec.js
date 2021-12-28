/// <reference types="Cypress" />

context("Shop Employee", () => {
     it("Create a new customer", () => {
        
        cy.clearLocalStorage();
        cy.loginshopemp()
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