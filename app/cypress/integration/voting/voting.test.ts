describe('Voting Page', () => {
  it('loads voting page', () => {
    cy.visit('/voting')
    cy.get('#voting-proposals').should('be.visible')
  })
})
