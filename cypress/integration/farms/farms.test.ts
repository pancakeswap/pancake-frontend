describe('Farms Page', () => {
  it('loads live farms', () => {
    cy.visit('/farms')
    cy.get('#farms-table').should('be.visible')
  })

  it('loads finished farms', () => {
    cy.visit('/farms/history')
    cy.get('#staked-only-farms').click({ force: true })
    cy.get('#farms-table').should('be.visible')
  })
})
