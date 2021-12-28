/// <reference types="Cypress" />

context("Topup Wallet", () => {
    it("Topup a wallet", () => {
        cy.loginshopemp()
       cy.getByTestId("topup-button").click()
       cy.url().should('eq', "http://localhost:3000/shopemployee/topupwallet/")
       
       
       cy.getByTestId("filter").type("Customer").should("have.value", "Customer")
       cy.getByTestId("list").within( () =>     {
           cy.getById("customertest@gmail.com").within( () => {         
                cy.getByTestId("mail").should("have.text", "Mail: customertest@gmail.com")
                cy.getByTestId("wallet-amount").should("have.text", "Amount in Wallet: 0 €")
                cy.getByTestId("newamount").type("100")
                cy.getByTestId("save-button").click()
                
                cy.intercept("POST", {
                    url : "/api/customer/wallet/:id/:amount",
                    statusCode: 200,
                    timeout: 5000 },
                    ) 
                 cy.getByTestId("wallet-amount").should("have.text", "Amount in Wallet: 100 €")
            })
           }) 
        
    

    })

})