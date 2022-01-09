/// <reference types="Cypress" />

context("New Order", () => {

it("Create a new order",() => {
    cy.logincustomer()
    cy.getById("time-elapsed").should("not.exist")

    const dayjs = require("dayjs");
    
    
    //fill the basket
    cy.getById('table-prod').within(() => {
      cy.get("tbody").find('tr').its('length').should('be.gte', 2)
      cy.get("tbody").getByTestId('product-item-1').within(() => {
        cy.getById("add").click()
      })
      cy.get("tbody").getByTestId('product-item-1').within(() => {
        cy.getById("remove").click()
      })
      cy.get("tbody").getByTestId('product-item-2').within(() => {
        cy.getById("add").click()
        cy.getById("add").click()
      })
      cy.get("tbody").getByTestId('product-item-3').within(() => {
        cy.getById("add").click()
      })
      cy.get("tbody").getByTestId('product-item-1').within(() => {
        cy.getById("add").click()
      })

    })

    cy.getById("basket").click()
    cy.getById("empty").should("not.exist")
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD")
    cy.getById("orderconfirmation").within(() => {
      cy.getById("date").type(tomorrow).should("have.value", tomorrow)
      cy.getById("time").type("12:00").should("have.value", "12:00")
      cy.getById("delivery").check().should("have.value", "on")
      cy.getById("address").type("Via Fermi 2").should("have.value", "Via Fermi 2")
      cy.getById("city").type("Torino").should("have.value", "Torino")
      cy.getById("cap").type("10141").should("have.value", "10141")
      cy.getById("sendorder").click()
    })
    
    cy.getById("receipt").should("be.visible").within(() => {
        cy.getById("items-list").within(()=>{
          cy.get("tr").its('length').should('be.gte', 2)
        })
        cy.getById("delivery").within( () => {
          cy.getById("address").should("have.text", "Via Fermi 2, Torino 10141")
          cy.getById("date").should("have.text", `${tomorrow} at 12:00`)
        })
        cy.getById("sendorder").click()
        cy.intercept("/api/order/customer", {statusCode:200})
    })

  })
})