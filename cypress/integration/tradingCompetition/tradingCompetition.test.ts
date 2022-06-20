describe('Trading Competition Page', () => {
  it('loads trading competition page', () => {
    cy.visit('/competition')
    cy.get('#pcs-competition-page').should('be.visible')
  })
})
