describe('IFO Page', () => {
  it('loads Next IFO page', () => {
    cy.visit('/ifo')
    cy.get('#current-ifo').should('be.visible')
  })

  it('loads Past IFOs page', () => {
    cy.visit('/ifo/history')
    cy.url().should('contain', '/ifo/history')
    cy.get('#past-ifos').should('be.visible')
  })
})
