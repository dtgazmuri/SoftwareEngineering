/// <reference types="Cypress" />

const dayjs = require("dayjs");

context("Add order", () => {

    it("create a new order", () => {
        cy.loginshopemp()
     
        cy.getByTestId("show-button").click()
        cy.url().should('eq', "http://localhost:3000/shopemployee/products")
        cy.getById("time-elapsed").should("not.exist")
        cy.getById("filter").type("CustomerTest")
        cy.getById("filter-select").select("CustomerTest Customer")

        cy.getById('table-prod').within(() => {
            cy.get("tbody").find('tr').should('have.not.length', 0)
            cy.get("tbody").getByTestId('product-item-1').within(() => {
                cy.getById("add").click()
                cy.getById("booked").should("have.text", 1)
            })
            cy.get("tbody").getByTestId('product-item-1').within(() => {
                cy.getById("remove").click()
                cy.getById("booked").should("have.text", "-")
            })
            cy.get("tbody").getByTestId('product-item-0').within(() => {
                cy.getById("add").click()
                cy.getById("booked").should("have.text", 1)
                cy.getById("add").click()
                cy.getById("booked").should("have.text", 2)  
            })
            cy.get("tbody").getByTestId('product-item-0').within(() => {
                cy.getById("add").click()
                cy.getById("booked").should("have.text", 3)
            })
            cy.get("tbody").getByTestId('product-item-1').within(() => {
                cy.getById("add").click()
                cy.getById("booked").should("have.text", 1)
            })
            
        })
        const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD")
        cy.getById("confirm").within(() => {
            cy.getById("date").type(tomorrow).should("have.value", tomorrow)
            cy.getById("time").type("12:00").should("have.value", "12:00")
            cy.getById("delivery").check().should("have.value", "on")
            cy.getById("address").type("Via Fermi 2").should("have.value", "Via Fermi 2")
            cy.getById("city").type("Torino").should("have.value", "Torino")
            cy.getById("cap").type("10141").should("have.value", "10141")
            cy.getById("confirm-button").click()
        })
        cy.getById("receipt").should("be.visible").within(() => {
           cy.getById("items").within( () => {
            cy.getById("quantity").should("have.text", 4)
            cy.getById("quantity").should("have.text", 4)
           })
           cy.getById("delivery").within( () => {
            cy.getById("address").should("have.text", "Via Fermi 2, Torino 10141")
            cy.getById("date").should("have.text", `${tomorrow} at 12:00`)
           })
           cy.getById("sendorder").click()

        })

    })

})