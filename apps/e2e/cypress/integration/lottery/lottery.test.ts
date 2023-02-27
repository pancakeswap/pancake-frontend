describe('Lottery Page', () => {
  it('loads lottery page', () => {
    cy.visit('/lottery')
    cy.get('#lottery-hero-title').should('be.visible')
  })
})
