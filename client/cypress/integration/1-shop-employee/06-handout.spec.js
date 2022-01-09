/// <reference types="Cypress" />

const dayjs = require("dayjs");

context("Handout Order", () => {

    it("create a new order", () => {
        cy.clock(new Date(2022, 0, 12, 14, 19, 0), ['Date'])
        cy.loginshopemp()
        cy.url().should('eq', "http://localhost:3000/shopemployee")
        cy.getByTestId("handout-button").click()
        cy.url().should('eq', "http://localhost:3000/shopemployee/handout")
        cy.getByTestId("customertest@gmail.com").within(() => {
            cy.getByTestId("order-data").within(() => {
                cy.getByTestId("username").should("have.text", "Customer mail: customertest@gmail.com")
                cy.getByTestId("state").should("have.text", "Order state: pending")

            })
            cy.getByTestId("handout-button").click()
            cy.getByTestId("order-data").within(() => {
                cy.getByTestId("state").should("have.text", "Order state: delivered")
            })

        })
    })
})