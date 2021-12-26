/// <reference types="Cypress" />

context("Ack a order", () => {
  
  it("Create a new order",() => {
    cy.visit("localhost:3000");
    cy.getById("login-col").click()
    cy.url().should('eq', "http://localhost:3000/loginpage")
    cy.getByTestId("username").type("customer@gmail.com").should("have.value", "customer@gmail.com")
    cy.getByTestId("password").type("customer").should("have.value", "customer")
    cy.getByTestId("login-button").click()
    cy.location('pathname', { timeout: 10000 }).should('eq', '/customer');

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
      cy.getById("address").should("exist").type("Via Fermi 2").should("have.value", "Via Fermi 2")
      cy.getById("sendorder").click()
    })
    
    cy.getById("receipt").should("be.visible").within(() => {
        cy.getById("items-list").within(()=>{
          cy.get("tr").its('length').should('be.gte', 2)
        })
        cy.getById("delivery").within( () => {
         cy.getById("address").should("have.text", "Via Fermi 2")
         cy.getById("date").should("have.text", `${tomorrow} at 12:00`)
        })
        cy.getById("sendorder").click()
        cy.intercept("/api/order/customer", {statusCode:200})
        cy.getByTestId("logout").click()

    })
  })
  
  it("Log as manager", () => {
    cy.getById("login-col").click()
    cy.url().should('eq', "http://localhost:3000/loginpage")
    cy.getByTestId("username").type("manager@gmail.com").should("have.value", "manager@gmail.com")
    cy.getByTestId("password").type("manager").should("have.value", "manager")
    cy.getByTestId("login-button").click()
    cy.location('pathname', { timeout: 10000 }).should('eq', '/manager');

  })

  it("Ack order", () => {
    cy.getById("del-button").click()
    
    


  })

})