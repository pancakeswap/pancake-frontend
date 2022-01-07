describe('Farms Page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://nodes.pancakeswap.com').as('rpcCall')
    cy.visit('/farms')
  })

  afterEach(() => {
    cy.get('@rpcCall.all').then((res) => {
      cy.task('log', `RPC calls total: ${res.length}`)
      Cypress.log({
        name: 'RPC Calls',
        message: res.length,
      })
    })
  })

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
