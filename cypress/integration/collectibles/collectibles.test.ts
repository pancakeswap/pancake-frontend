describe('Collectibles Page', () => {
  it('loads collectibles page', () => {
    cy.visit('/collectibles')
    cy.get('#nft-Sunny').should('be.visible')
  })
})
