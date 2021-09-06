describe('Farms Page', () => {
  beforeEach(() => cy.visit('/farms'))

  it('loads live farms', () => {
    cy.get('#farms-table').should('be.visible')
  })

  it('loads finished farms', () => {
    cy.get('#finished-farms-button').click()
    cy.get('#staked-only-farms').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(30000)
    cy.get('#farms-table').should('be.visible')
  })
})
