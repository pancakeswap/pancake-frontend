describe('Predictions Page', () => {
  it('User can get past to disclaimer', () => {
    cy.visit('/prediction')
    cy.get('#predictions-risk-disclaimer').should('be.visible')
    cy.get('#prediction-disclaimer-continue').should('be.disabled')
    cy.get('#responsibility-checkbox').click()
    cy.get('#beta-checkbox').click()
    cy.get('#prediction-disclaimer-continue').should('not.be.disabled')
    cy.get('#prediction-disclaimer-continue').click()
    cy.get('#predictions-risk-disclaimer').should('not.exist')
  })
})
