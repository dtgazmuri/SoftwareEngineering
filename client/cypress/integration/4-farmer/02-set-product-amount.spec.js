/// <reference types="Cypress" />

context("Set product amount", () => {
    
    it("Set a product amount", () => {
        cy.clock(new Date(2022, 0, 10, 14, 19, 0), ['Date'])
        cy.loginfarmer();
        cy.getById("prod-button").click()
        cy.getById("1").within(() => {
            cy.getById("quantity").type("1")
            cy.getById("setamount").click()
            cy.getById("msg").should("have.text", "Availability of product 1 updated successfully. New availability: 01")
        })


    })
})