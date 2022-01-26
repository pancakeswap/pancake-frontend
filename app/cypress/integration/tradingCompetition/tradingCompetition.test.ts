describe('Trading Competition Page', () => {
  it('loads trading competition page', () => {
    cy.visit('/competition')
    cy.get('#top-traders-card').should('be.visible')
  })
})
